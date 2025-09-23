import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Eye, Filter } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GiftCardVerification {
  id: string;
  user_id: string;
  email: string;
  giftcard_name: string;
  amount: string;
  pin: string | null;
  code: string;
  country: string;
  front_image_path: string | null;
  back_image_path: string | null;
  status: string;
  admin_result_type: string | null;
  admin_result_amount: number | null;
  admin_notes: string | null;
  created_at: string;
  verified_at: string | null;
}

export default function Admin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [verifications, setVerifications] = useState<GiftCardVerification[]>([]);
  const [filteredVerifications, setFilteredVerifications] = useState<GiftCardVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedVerification, setSelectedVerification] = useState<GiftCardVerification | null>(null);
  const [adminForm, setAdminForm] = useState({
    result_type: "",
    result_amount: "",
    notes: ""
  });

  useEffect(() => {
    fetchVerifications();
  }, []);

  useEffect(() => {
    filterVerifications();
  }, [verifications, selectedFilter]);

  const fetchVerifications = async () => {
    try {
      const { data, error } = await supabase
        .from('gift_card_verifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVerifications(data || []);
    } catch (error) {
      console.error('Error fetching verifications:', error);
      toast({
        title: "Error",
        description: "Failed to load verifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterVerifications = () => {
    if (selectedFilter === "all") {
      setFilteredVerifications(verifications);
    } else {
      setFilteredVerifications(
        verifications.filter(v => 
          selectedFilter === "pending" 
            ? v.status === "pending" && !v.admin_result_type
            : v.admin_result_type === selectedFilter
        )
      );
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'valid': return 'border-green-500 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-300 dark:border-green-600';
      case 'invalid': return 'border-red-500 text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-300 dark:border-red-600';
      case 'used': return 'border-gray-500 text-gray-700 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-600';
      default: return 'border-blue-500 text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-600';
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'valid': return '✓';
      case 'invalid': return '✗';
      case 'used': return '⦸';
      default: return '⏳';
    }
  };

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case 'valid': return 'Valid';
      case 'invalid': return 'Invalid'; 
      case 'used': return 'Used';
      default: return 'Pending';
    }
  };

  const handleUpdateVerification = async () => {
    if (!selectedVerification) return;

    try {
      const { error } = await supabase
        .from('gift_card_verifications')
        .update({
          admin_result_type: adminForm.result_type,
          admin_result_amount: adminForm.result_amount ? parseFloat(adminForm.result_amount) : null,
          admin_notes: adminForm.notes || null,
          admin_user_id: user?.id,
          verified_at: new Date().toISOString()
        })
        .eq('id', selectedVerification.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Verification updated successfully",
      });

      setSelectedVerification(null);
      setAdminForm({ result_type: "", result_amount: "", notes: "" });
      fetchVerifications();
    } catch (error) {
      console.error('Error updating verification:', error);
      toast({
        title: "Error",
        description: "Failed to update verification",
        variant: "destructive",
      });
    }
  };

  const handleQuickStatusUpdate = async (verificationId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('gift_card_verifications')
        .update({
          admin_result_type: status,
          admin_user_id: user?.id,
          verified_at: new Date().toISOString()
        })
        .eq('id', verificationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Verification marked as ${status}`,
      });

      fetchVerifications();
    } catch (error) {
      console.error('Error updating verification:', error);
      toast({
        title: "Error",
        description: "Failed to update verification",
        variant: "destructive",
      });
    }
  };

  const openVerificationModal = (verification: GiftCardVerification) => {
    setSelectedVerification(verification);
    setAdminForm({
      result_type: verification.admin_result_type || "",
      result_amount: verification.admin_result_amount?.toString() || "",
      notes: verification.admin_notes || ""
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">Admin Dashboard</h1>
            <p className="text-lg text-muted-foreground">Manage gift card verifications</p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">Gift Card Verifications</CardTitle>
                <div className="flex items-center gap-4">
                  <Filter className="h-4 w-4" />
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="w-48 bg-background border-2">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-2 shadow-lg z-50">
                      <SelectItem value="all">All Verifications</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="valid">Valid</SelectItem>
                      <SelectItem value="invalid">Invalid</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredVerifications.length > 0 ? (
                <div className="space-y-4">
                  {filteredVerifications.map((verification) => (
                    <div key={verification.id} className="border rounded-lg p-4 hover:bg-muted/20 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{verification.giftcard_name}</h3>
                            <Badge className={getStatusColor(verification.admin_result_type || 'pending')}>
                              <span className="mr-1">{getStatusIcon(verification.admin_result_type || 'pending')}</span>
                              {getStatusLabel(verification.admin_result_type || 'pending')}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Email: {verification.email}</p>
                            <p>Amount: ${verification.amount}</p>
                            <p>Code: {verification.code}</p>
                            <p>Country: {verification.country}</p>
                            <p>Submitted: {new Date(verification.created_at).toLocaleDateString()}</p>
                          </div>
                          {verification.admin_notes && (
                            <p className="text-sm italic text-muted-foreground">
                              Note: {verification.admin_notes}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          {verification.admin_result_type === 'valid' && verification.admin_result_amount && (
                            <p className="text-green-600 font-medium text-sm">
                              +${verification.admin_result_amount.toFixed(2)}
                            </p>
                          )}
                          
                          {/* Quick Action Buttons */}
                          {!verification.admin_result_type && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Button 
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1"
                                onClick={() => handleQuickStatusUpdate(verification.id, 'valid')}
                              >
                                Valid
                              </Button>
                              <Button 
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1"
                                onClick={() => handleQuickStatusUpdate(verification.id, 'used')}
                              >
                                Used
                              </Button>
                              <Button 
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1"
                                onClick={() => handleQuickStatusUpdate(verification.id, 'invalid')}
                              >
                                Invalid
                              </Button>
                            </div>
                          )}
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openVerificationModal(verification)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Review Gift Card Verification</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6">
                                {/* Verification Details */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <strong>Gift Card:</strong> {selectedVerification?.giftcard_name}
                                  </div>
                                  <div>
                                    <strong>Expected Amount:</strong> ${selectedVerification?.amount}
                                  </div>
                                  <div>
                                    <strong>Code:</strong> {selectedVerification?.code}
                                  </div>
                                  <div>
                                    <strong>PIN:</strong> {selectedVerification?.pin || 'N/A'}
                                  </div>
                                  <div>
                                    <strong>Country:</strong> {selectedVerification?.country}
                                  </div>
                                  <div>
                                    <strong>Email:</strong> {selectedVerification?.email}
                                  </div>
                                </div>

                                {/* Images */}
                                <div className="space-y-4">
                                  <h4 className="font-medium">Card Images</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    {selectedVerification?.front_image_path && (
                                      <div>
                                        <p className="text-sm font-medium mb-2">Front</p>
                                        <img 
                                          src={selectedVerification.front_image_path} 
                                          alt="Front of card" 
                                          className="w-full h-32 object-cover rounded border"
                                        />
                                      </div>
                                    )}
                                    {selectedVerification?.back_image_path && (
                                      <div>
                                        <p className="text-sm font-medium mb-2">Back</p>
                                        <img 
                                          src={selectedVerification.back_image_path} 
                                          alt="Back of card" 
                                          className="w-full h-32 object-cover rounded border"
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Admin Form */}
                                <div className="space-y-4 border-t pt-4">
                                  <h4 className="font-medium">Admin Review</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Result *</Label>
                                      <Select 
                                        value={adminForm.result_type} 
                                        onValueChange={(value) => setAdminForm({...adminForm, result_type: value})}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select result" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="valid">Valid</SelectItem>
                                          <SelectItem value="invalid">Invalid</SelectItem>
                                          <SelectItem value="used">Used</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label>Actual Amount (if valid)</Label>
                                      <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={adminForm.result_amount}
                                        onChange={(e) => setAdminForm({...adminForm, result_amount: e.target.value})}
                                        disabled={adminForm.result_type !== 'valid'}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Notes</Label>
                                    <Textarea
                                      placeholder="Add any notes about this verification..."
                                      value={adminForm.notes}
                                      onChange={(e) => setAdminForm({...adminForm, notes: e.target.value})}
                                    />
                                  </div>
                                  <Button 
                                    onClick={handleUpdateVerification} 
                                    className="w-full"
                                    disabled={!adminForm.result_type}
                                  >
                                    Update Verification
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No verifications found for the selected filter.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}