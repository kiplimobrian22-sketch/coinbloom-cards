import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Smartphone, DollarSign, Building, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  currency: string;
  cartItems: Array<{ id: string; name: string; amount: number; quantity: number; price: number }>;
}

const CheckoutModal = ({ isOpen, onClose, total, currency, cartItems }: CheckoutModalProps) => {
  const { toast } = useToast();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentReceipt, setPaymentReceipt] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  const [creditCardForm, setCreditCardForm] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    billingAddress: "",
    city: "",
    postalCode: "",
    country: ""
  });

  const paymentMethods = [
    { id: "credit", label: "Credit Card", icon: CreditCard },
    { id: "cashapp", label: "CashApp", icon: Smartphone, tag: "$btarus" },
    { id: "etransfer", label: "E-Transfer", icon: Building, tag: "kiplimobrian22@gmail.com" },
    { id: "paypal", label: "PayPal", icon: DollarSign, tag: "payments@giftcardshub.com" }
  ];

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentReceipt(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setReceiptPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReceipt = () => {
    setPaymentReceipt(null);
    setReceiptPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // For non-credit methods, require receipt upload
    if (selectedPaymentMethod !== "credit" && !paymentReceipt) {
      toast({
        title: "Payment Receipt Required",
        description: "Please upload a screenshot of your payment confirmation.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    toast({
      title: "Order Placed Successfully!",
      description: selectedPaymentMethod === "credit" 
        ? "Your gift cards will be delivered to your email within 5-10 minutes."
        : "Payment received! Your order will be processed within 24 hours after verification.",
    });

    setIsProcessing(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} - ${item.amount} x {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 font-semibold flex justify-between">
                  <span>Total:</span>
                  <span>${total.toFixed(2)} {currency}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                <TabsList className="grid grid-cols-2 lg:grid-cols-4">
                  {paymentMethods.map(method => (
                    <TabsTrigger key={method.id} value={method.id}>
                      <method.icon className="h-4 w-4 mr-2" />
                      {method.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="credit" className="mt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={creditCardForm.cardNumber}
                          onChange={(e) => setCreditCardForm({...creditCardForm, cardNumber: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date *</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={creditCardForm.expiryDate}
                          onChange={(e) => setCreditCardForm({...creditCardForm, expiryDate: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={creditCardForm.cvv}
                          onChange={(e) => setCreditCardForm({...creditCardForm, cvv: e.target.value})}
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="cardholderName">Cardholder Name *</Label>
                        <Input
                          id="cardholderName"
                          placeholder="John Doe"
                          value={creditCardForm.cardholderName}
                          onChange={(e) => setCreditCardForm({...creditCardForm, cardholderName: e.target.value})}
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="billingAddress">Billing Address *</Label>
                        <Input
                          id="billingAddress"
                          placeholder="123 Main Street"
                          value={creditCardForm.billingAddress}
                          onChange={(e) => setCreditCardForm({...creditCardForm, billingAddress: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          placeholder="New York"
                          value={creditCardForm.city}
                          onChange={(e) => setCreditCardForm({...creditCardForm, city: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code *</Label>
                        <Input
                          id="postalCode"
                          placeholder="12345"
                          value={creditCardForm.postalCode}
                          onChange={(e) => setCreditCardForm({...creditCardForm, postalCode: e.target.value})}
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="country">Country *</Label>
                        <Select value={creditCardForm.country} onValueChange={(value) => setCreditCardForm({...creditCardForm, country: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                            <SelectItem value="AU">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full btn-primary" disabled={isProcessing}>
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                          Processing Payment...
                        </>
                      ) : (
                        `Pay $${total.toFixed(2)} ${currency}`
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {paymentMethods.filter(method => method.tag).map(method => (
                  <TabsContent key={method.id} value={method.id} className="mt-6">
                    <div className="space-y-4">
                      <div className="text-center p-8 border rounded-lg bg-muted/20">
                        <method.icon className="h-16 w-16 mx-auto mb-4 text-primary" />
                        <h3 className="text-xl font-semibold mb-2">Pay with {method.label}</h3>
                        <div className="bg-background border rounded p-4">
                          <p className="font-mono text-lg font-bold text-primary">Coming Soon</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">
                          This payment method will be available soon
                        </p>
                      </div>
                      
                      {/* Payment Receipt Upload */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="receipt">Upload Payment Receipt *</Label>
                          <p className="text-sm text-muted-foreground mb-2">
                            Please upload a screenshot of your payment confirmation
                          </p>
                          {!receiptPreview ? (
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                              <Input
                                id="receipt"
                                type="file"
                                accept="image/*"
                                onChange={handleReceiptUpload}
                                className="hidden"
                              />
                              <Label htmlFor="receipt" className="cursor-pointer">
                                <span className="text-sm font-medium">Click to upload receipt</span>
                                <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                              </Label>
                            </div>
                          ) : (
                            <div className="relative">
                              <img 
                                src={receiptPreview} 
                                alt="Payment receipt" 
                                className="w-full max-h-40 object-cover rounded-lg border"
                              />
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={removeReceipt}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Button onClick={handleSubmit} className="w-full btn-primary" disabled={isProcessing}>
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                            Confirming Payment...
                          </>
                        ) : (
                          "I have sent the payment"
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;