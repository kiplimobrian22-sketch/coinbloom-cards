-- First, drop the problematic policy that might cause infinite recursion
DROP POLICY IF EXISTS "Admins can view all verifications" ON public.gift_card_verifications;
DROP POLICY IF EXISTS "Users can view their own verifications or admins can view all" ON public.gift_card_verifications;

-- Create a security definer function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(is_admin, false) FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Recreate the SELECT policy using the security definer function
CREATE POLICY "Users can view their own verifications or admins can view all" 
ON public.gift_card_verifications 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) 
  OR 
  public.is_current_user_admin()
);