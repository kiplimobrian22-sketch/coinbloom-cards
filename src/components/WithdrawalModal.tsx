import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Building, Smartphone, Send, ArrowRightLeft } from 'lucide-react';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  currency: string;
  defaultTab?: string;
}

export default function WithdrawalModal({
  isOpen,
  onClose,
  availableBalance,
  currency,
  defaultTab = 'bank'
}: WithdrawalModalProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [withdrawalMethod, setWithdrawalMethod] = useState(defaultTab);
  const [amount, setAmount] = useState('');
  
  // Bank transfer form state
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    routingNumber: '',
    accountHolderName: '',
    bankName: ''
  });

  // Digital payment form state
  const [digitalDetails, setDigitalDetails] = useState({
    handle: '',
    email: ''
  });

  // Transfer form state
  const [transferDetails, setTransferDetails] = useState({
    recipientEmail: '',
    note: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid amount to withdraw",
      });
      return;
    }

    if (parseFloat(amount) > availableBalance) {
      toast({
        variant: "destructive",
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment Processing",
        description: `Your ${withdrawalMethod === 'transfer' ? 'transfer' : 'withdrawal'} of ${amount} ${currency} is being processed. You'll receive confirmation shortly.`,
      });
      onClose();
      
      // Reset form
      setAmount('');
      setBankDetails({
        accountNumber: '',
        routingNumber: '',
        accountHolderName: '',
        bankName: ''
      });
      setDigitalDetails({
        handle: '',
        email: ''
      });
      setTransferDetails({
        recipientEmail: '',
        note: ''
      });
    }, 2000);
  };

  const withdrawalMethods = [
    { id: 'bank', label: 'Bank Transfer', icon: Building },
    { id: 'cashapp', label: 'CashApp', icon: Smartphone },
    { id: 'venmo', label: 'Venmo', icon: Smartphone },
    { id: 'zelle', label: 'Zelle', icon: CreditCard },
    { id: 'etransfer', label: 'E-Transfer', icon: Send },
    { id: 'transfer', label: 'Transfer to User', icon: ArrowRightLeft }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Available Balance</p>
            <p className="text-lg font-semibold">{availableBalance.toFixed(2)} {currency}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Withdraw</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              max={availableBalance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Enter amount (max ${availableBalance.toFixed(2)} ${currency})`}
            />
          </div>

          <Tabs value={withdrawalMethod} onValueChange={setWithdrawalMethod}>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              {withdrawalMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <TabsTrigger 
                    key={method.id} 
                    value={method.id}
                    className="text-xs flex flex-col gap-1 h-16"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{method.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value="bank" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Bank Transfer Details</CardTitle>
                  <CardDescription>
                    Enter your bank account information for direct transfer
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={bankDetails.accountNumber}
                        onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                        placeholder="Your account number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="routingNumber">Routing Number</Label>
                      <Input
                        id="routingNumber"
                        value={bankDetails.routingNumber}
                        onChange={(e) => setBankDetails({...bankDetails, routingNumber: e.target.value})}
                        placeholder="Bank routing number"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountHolderName">Account Holder Name</Label>
                    <Input
                      id="accountHolderName"
                      value={bankDetails.accountHolderName}
                      onChange={(e) => setBankDetails({...bankDetails, accountHolderName: e.target.value})}
                      placeholder="Full name on account"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={bankDetails.bankName}
                      onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                      placeholder="Name of your bank"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cashapp" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>CashApp Details</CardTitle>
                  <CardDescription>
                    Enter your CashApp information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cashappHandle">CashApp Handle</Label>
                    <Input
                      id="cashappHandle"
                      value={digitalDetails.handle}
                      onChange={(e) => setDigitalDetails({...digitalDetails, handle: e.target.value})}
                      placeholder="$yourcashtag"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cashappEmail">Email Address</Label>
                    <Input
                      id="cashappEmail"
                      type="email"
                      value={digitalDetails.email}
                      onChange={(e) => setDigitalDetails({...digitalDetails, email: e.target.value})}
                      placeholder="your@email.com"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="venmo" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Venmo Details</CardTitle>
                  <CardDescription>
                    Enter your Venmo information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="venmoHandle">Venmo Username</Label>
                    <Input
                      id="venmoHandle"
                      value={digitalDetails.handle}
                      onChange={(e) => setDigitalDetails({...digitalDetails, handle: e.target.value})}
                      placeholder="@yourusername"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="venmoEmail">Email Address</Label>
                    <Input
                      id="venmoEmail"
                      type="email"
                      value={digitalDetails.email}
                      onChange={(e) => setDigitalDetails({...digitalDetails, email: e.target.value})}
                      placeholder="your@email.com"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="zelle" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Zelle Details</CardTitle>
                  <CardDescription>
                    Enter your Zelle information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="zelleEmail">Zelle Email/Phone</Label>
                    <Input
                      id="zelleEmail"
                      value={digitalDetails.email}
                      onChange={(e) => setDigitalDetails({...digitalDetails, email: e.target.value})}
                      placeholder="your@email.com or phone number"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="etransfer" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>E-Transfer Details</CardTitle>
                  <CardDescription>
                    Enter your E-Transfer information (Canada)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="etransferEmail">Email Address</Label>
                    <Input
                      id="etransferEmail"
                      type="email"
                      value={digitalDetails.email}
                      onChange={(e) => setDigitalDetails({...digitalDetails, email: e.target.value})}
                      placeholder="your@email.com"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transfer" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Transfer to Another User</CardTitle>
                  <CardDescription>
                    Send money to another user on our platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipientEmail">Recipient Email</Label>
                    <Input
                      id="recipientEmail"
                      type="email"
                      value={transferDetails.recipientEmail}
                      onChange={(e) => setTransferDetails({...transferDetails, recipientEmail: e.target.value})}
                      placeholder="recipient@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transferNote">Note (Optional)</Label>
                    <Input
                      id="transferNote"
                      value={transferDetails.note}
                      onChange={(e) => setTransferDetails({...transferDetails, note: e.target.value})}
                      placeholder="Add a note for the recipient"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isProcessing || !amount}
              className="flex-1"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </div>
              ) : (
                `${withdrawalMethod === 'transfer' ? 'Send Transfer' : 'Submit Withdrawal'}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}