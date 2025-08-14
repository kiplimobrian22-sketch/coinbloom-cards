import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const VerifyGiftcard = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    country: "",
    giftcardName: "",
    code: "",
    pin: "",
    amount: "",
    email: ""
  });

  const countries = [
    "United States", "Canada", "United Kingdom", "Australia", "Germany", 
    "France", "Japan", "Brazil", "India", "Mexico"
  ];

  const giftcardBrands = [
    "Amazon", "iTunes", "Google Play", "Steam", "PlayStation", 
    "Xbox", "Walmart", "Target", "Best Buy", "eBay"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Verification Submitted",
      description: "Your gift card verification request has been submitted successfully. You'll receive results via email within 24 hours.",
    });

    setIsSubmitting(false);
    setFormData({
      country: "",
      giftcardName: "",
      code: "",
      pin: "",
      amount: "",
      email: ""
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
                    <Select value={formData.giftcardName} onValueChange={(value) => handleInputChange("giftcardName", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gift card brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {giftcardBrands.map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  <div className="space-y-2">
                    <Label htmlFor="pin">PIN (if applicable)</Label>
                    <Input
                      id="pin"
                      placeholder="Enter PIN if required"
                      value={formData.pin}
                      onChange={(e) => handleInputChange("pin", e.target.value)}
                      className="font-mono"
                    />
                  </div>

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

                {/* Security Notice */}
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Security Notice</h4>
                      <p className="text-sm text-muted-foreground">
                        Your information is encrypted and secure. We never store sensitive gift card data 
                        and all verifications are processed through secure channels.
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
    </div>
  );
};

export default VerifyGiftcard;