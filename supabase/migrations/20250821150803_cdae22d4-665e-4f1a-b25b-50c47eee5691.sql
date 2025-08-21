BEGIN;

-- Ensure function resolves enum types regardless of search_path issues
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  ref_code TEXT;
  ref_user_id UUID;
  user_currency public.currency_code := 'USD'::public.currency_code;
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
      WHEN 'CA' THEN user_currency := 'CAD'::public.currency_code; bonus_amount := 6.50;
      WHEN 'AU' THEN user_currency := 'AUD'::public.currency_code; bonus_amount := 7.50;
      WHEN 'GB' THEN user_currency := 'GBP'::public.currency_code; bonus_amount := 4.00;
      WHEN 'DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'AT', 'IE', 'PT', 'FI', 'SE', 'DK', 'NO', 'CH', 'LU' THEN 
        user_currency := 'EUR'::public.currency_code; bonus_amount := 4.50;
      ELSE user_currency := 'USD'::public.currency_code; bonus_amount := 5.00;
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
    COALESCE((NEW.raw_user_meta_data->>'country')::public.country_code, 'US'::public.country_code),
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
  VALUES (NEW.id, 'signup_bonus'::public.transaction_type, bonus_amount, user_currency, 'Welcome bonus - pending verification');

  -- Handle referral if exists
  IF ref_user_id IS NOT NULL THEN
    INSERT INTO public.referrals (referrer_user_id, referred_user_id, referral_code, bonus_currency)
    VALUES (ref_user_id, NEW.id, NEW.raw_user_meta_data->>'referral_code', user_currency);
  END IF;

  RETURN NEW;
END;
$function$;

-- Recreate the trigger to be safe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMIT;