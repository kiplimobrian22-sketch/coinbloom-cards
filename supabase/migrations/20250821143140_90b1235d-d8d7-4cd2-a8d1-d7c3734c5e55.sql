-- Create country enum
CREATE TYPE public.country_code AS ENUM (
  'US', 'CA', 'AU', 'GB', 'DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'AT', 'IE', 'PT', 'FI', 'SE', 'DK', 'NO', 'CH', 'LU'
);

-- Create currency enum
CREATE TYPE public.currency_code AS ENUM ('USD', 'CAD', 'AUD', 'GBP', 'EUR');

-- Create transaction type enum
CREATE TYPE public.transaction_type AS ENUM (
  'signup_bonus', 'referral_bonus', 'gift_card_purchase', 'gift_card_sale', 
  'gift_card_exchange', 'deposit', 'withdrawal', 'admin_adjustment'
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  country country_code NOT NULL DEFAULT 'US',
  currency currency_code NOT NULL DEFAULT 'USD',
  referral_code TEXT UNIQUE,
  referred_by_code TEXT,
  signup_bonus_earned BOOLEAN DEFAULT FALSE,
  signup_bonus_redeemable BOOLEAN DEFAULT FALSE,
  gift_cards_verified INTEGER DEFAULT 0,
  gift_cards_purchased INTEGER DEFAULT 0,
  gift_cards_sold INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create user_balances table
CREATE TABLE public.user_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  currency currency_code NOT NULL,
  amount DECIMAL(10,2) DEFAULT 0.00,
  pending_amount DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, currency)
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency currency_code NOT NULL,
  description TEXT,
  reference_id UUID,
  admin_user_id UUID REFERENCES auth.users(id),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create referrals table
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  bonus_amount DECIMAL(10,2) DEFAULT 5.00,
  bonus_currency currency_code DEFAULT 'USD',
  bonus_earned BOOLEAN DEFAULT FALSE,
  bonus_redeemable BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(referred_user_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_balances
CREATE POLICY "Users can view their own balance" ON public.user_balances
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own balance" ON public.user_balances
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for referrals
CREATE POLICY "Users can view referrals they made or received" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_user_id OR auth.uid() = referred_user_id);

CREATE POLICY "System can insert referrals" ON public.referrals
  FOR INSERT WITH CHECK (true);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  ref_code TEXT;
  ref_user_id UUID;
  user_currency currency_code := 'USD';
  bonus_amount DECIMAL(10,2) := 5.00;
BEGIN
  -- Generate unique referral code
  ref_code := UPPER(SUBSTRING(MD5(NEW.id::text), 1, 8));
  
  -- Check if user was referred
  IF NEW.raw_user_meta_data->>'referral_code' IS NOT NULL THEN
    SELECT user_id INTO ref_user_id 
    FROM public.profiles 
    WHERE referral_code = NEW.raw_user_meta_data->>'referral_code';
  END IF;

  -- Determine currency based on country
  IF NEW.raw_user_meta_data->>'country' IS NOT NULL THEN
    CASE NEW.raw_user_meta_data->>'country'
      WHEN 'CA' THEN user_currency := 'CAD'; bonus_amount := 6.50;
      WHEN 'AU' THEN user_currency := 'AUD'; bonus_amount := 7.50;
      WHEN 'GB' THEN user_currency := 'GBP'; bonus_amount := 4.00;
      WHEN 'DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'AT', 'IE', 'PT', 'FI', 'SE', 'DK', 'NO', 'CH', 'LU' THEN 
        user_currency := 'EUR'; bonus_amount := 4.50;
      ELSE user_currency := 'USD'; bonus_amount := 5.00;
    END CASE;
  END IF;

  -- Insert profile
  INSERT INTO public.profiles (
    user_id, email, first_name, last_name, country, currency, 
    referral_code, referred_by_code, signup_bonus_earned
  ) VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    COALESCE((NEW.raw_user_meta_data->>'country')::country_code, 'US'),
    user_currency,
    ref_code,
    NEW.raw_user_meta_data->>'referral_code',
    true
  );

  -- Create user balance
  INSERT INTO public.user_balances (user_id, currency, pending_amount)
  VALUES (NEW.id, user_currency, bonus_amount);

  -- Create signup bonus transaction
  INSERT INTO public.transactions (user_id, type, amount, currency, description)
  VALUES (NEW.id, 'signup_bonus', bonus_amount, user_currency, 'Welcome bonus - pending verification');

  -- Handle referral if exists
  IF ref_user_id IS NOT NULL THEN
    INSERT INTO public.referrals (referrer_user_id, referred_user_id, referral_code, bonus_currency)
    VALUES (ref_user_id, NEW.id, NEW.raw_user_meta_data->>'referral_code', user_currency);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_balances_updated_at
  BEFORE UPDATE ON public.user_balances
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();