import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Plus, CheckCircle, X, Clock } from 'lucide-react';

interface GiftCardVerification {
  id: string;
  giftcard_name: string;
  amount: string;
  status: string;
  admin_result_type: string | null;
  admin_result_amount: number | null;
  admin_notes: string | null;
  created_at: string;
  verified_at: string | null;
  country: string;
}

export default function GiftCardStatus() {
  const { user } = useAuth();
  const [verifications, setVerifications] = useState<GiftCardVerification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchVerifications();
    }
  }, [user]);

  const fetchVerifications = async () => {
    try {
      const { data, error } = await supabase
        .from('gift_card_verifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVerifications(data || []);
    } catch (error) {
      console.error('Error fetching verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'invalid':
        return <X className="h-5 w-5 text-red-600" />;
      case 'used':
        return <div className="relative">
          <CreditCard className="h-5 w-5 text-gray-500" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-0.5 bg-gray-500 transform rotate-45"></div>
          </div>
        </div>;
      default:
        return <Clock className="h-5 w-5 text-blue-600" />;
    }
  };

  const getStatusBadge = (verification: GiftCardVerification) => {
    const status = verification.admin_result_type || 'pending';
    
    switch (status) {
      case 'valid':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Valid
          </Badge>
        );
      case 'invalid':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">
            <X className="h-3 w-3 mr-1" />
            Invalid
          </Badge>
        );
      case 'used':
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100">
            <span className="text-xs mr-1">⦸</span>
            Used
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const formatCurrency = (amount: string | number, currency: string = 'USD') => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `$${numAmount.toFixed(2)} ${currency}`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            My Gift Cards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            My Gift Cards
          </CardTitle>
          <Button size="sm" asChild>
            <Link to="/verify">
              <Plus className="h-4 w-4 mr-2" />
              Verify Card
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {verifications.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-lg mb-2">No Gift Cards Yet</h3>
            <p className="text-muted-foreground mb-4">
              Submit your first gift card for verification to get started
            </p>
            <Button asChild>
              <Link to="/verify">
                Verify Your First Card
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {verifications.map((verification) => (
              <div
                key={verification.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(verification.admin_result_type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">{verification.giftcard_name}</h4>
                      {getStatusBadge(verification)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Expected: {formatCurrency(verification.amount)}</span>
                      <span>•</span>
                      <span>Country: {verification.country}</span>
                      <span>•</span>
                      <span>Submitted: {new Date(verification.created_at).toLocaleDateString()}</span>
                    </div>
                    {verification.admin_notes && (
                      <p className="text-sm text-muted-foreground italic">
                        Admin Note: {verification.admin_notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {verification.admin_result_type === 'valid' && verification.admin_result_amount ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <p className="font-semibold text-green-600">
                        +{formatCurrency(verification.admin_result_amount)}
                      </p>
                    </div>
                  ) : verification.admin_result_type === 'used' ? (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 text-lg">⦸</span>
                      <p className="font-medium text-gray-600 line-through">
                        {formatCurrency(verification.amount)}
                      </p>
                    </div>
                  ) : verification.admin_result_type === 'invalid' ? (
                    <div className="flex items-center gap-2">
                      <X className="h-4 w-4 text-red-600" />
                      <p className="font-medium text-red-600">Not Valid</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <p className="font-medium text-blue-600">Under Review</p>
                    </div>
                  )}
                  {verification.verified_at && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Reviewed: {new Date(verification.verified_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}