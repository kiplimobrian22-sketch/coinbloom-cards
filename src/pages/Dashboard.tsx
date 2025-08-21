import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  DollarSign, 
  Users, 
  Gift, 
  TrendingUp,
  LogOut,
  Copy,
  CheckCircle,
  Clock
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  country: string;
  currency: string;
  referral_code: string;
  signup_bonus_earned: boolean;
  signup_bonus_redeemable: boolean;
  gift_cards_verified: number;
  gift_cards_purchased: number;
  gift_cards_sold: number;
}

interface UserBalance {
  amount: number;
  pending_amount: number;
  currency: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  currency: string;
  description: string | null;
  created_at: string;
}

export default function Dashboard() {
  const { user, signOut, loading } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
      
      // Set up real-time subscription for transactions and verifications
      const channel = supabase
        .channel('dashboard-updates')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'transactions',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            fetchUserData();
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'gift_card_verifications',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            fetchUserData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch user balance
      const { data: balanceData, error: balanceError } = await supabase
        .from('user_balances')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (balanceError) throw balanceError;
      setBalance(balanceData);

      // Fetch recent transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (transactionsError) throw transactionsError;
      setTransactions(transactionsData || []);

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load user data",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const copyReferralCode = async () => {
    if (profile?.referral_code) {
      await navigator.clipboard.writeText(profile.referral_code);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const getProgressToBonus = () => {
    if (!profile) return 0;
    const verified = profile.gift_cards_verified >= 3;
    const bought = profile.gift_cards_purchased >= 1;
    const sold = profile.gift_cards_sold >= 2;
    
    if (verified || bought || sold) return 100;
    
    const progress = Math.max(
      (profile.gift_cards_verified / 3) * 33,
      (profile.gift_cards_purchased / 1) * 33,
      (profile.gift_cards_sold / 2) * 34
    );
    
    return Math.round(progress);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back{profile?.first_name ? `, ${profile.first_name}` : ''}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your gift cards and track your earnings
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Balance Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {balance?.amount?.toFixed(2) || '0.00'} {balance?.currency || 'USD'}
              </div>
              {balance && balance.pending_amount > 0 && (
                <p className="text-xs text-muted-foreground">
                  +{balance.pending_amount.toFixed(2)} {balance.currency} pending
                </p>
              )}
            </CardContent>
          </Card>

          {/* Verified Cards */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cards Verified</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.gift_cards_verified || 0}</div>
              <p className="text-xs text-muted-foreground">
                Total verified
              </p>
            </CardContent>
          </Card>

          {/* Purchased Cards */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cards Bought</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.gift_cards_purchased || 0}</div>
              <p className="text-xs text-muted-foreground">
                Total purchased
              </p>
            </CardContent>
          </Card>

          {/* Sold Cards */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cards Sold</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.gift_cards_sold || 0}</div>
              <p className="text-xs text-muted-foreground">
                Total sold/exchanged
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Welcome Bonus Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Welcome Bonus
              </CardTitle>
              <CardDescription>
                Complete actions to unlock your bonus
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile?.signup_bonus_redeemable ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Bonus Ready to Claim!</span>
                </div>
              ) : profile?.signup_bonus_earned ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progress to unlock bonus</span>
                    <span className="text-sm font-medium">{getProgressToBonus()}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${getProgressToBonus()}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Complete one of: Verify 3+ cards, Buy 1 card, or Sell/exchange 2 cards
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-5 w-5" />
                  <span>Processing your welcome bonus...</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Referral Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Referral Program
              </CardTitle>
              <CardDescription>
                Earn {balance?.currency || 'USD'} for each friend you invite
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Your referral code:</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-mono text-lg px-3 py-1">
                    {profile?.referral_code}
                  </Badge>
                  <Button size="sm" variant="outline" onClick={copyReferralCode}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Share this code with friends to earn bonuses when they sign up and complete actions.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest transactions and activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">{transaction.description || transaction.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)} {transaction.currency}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {transaction.type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No transactions yet. Start by verifying or purchasing gift cards!
              </p>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}