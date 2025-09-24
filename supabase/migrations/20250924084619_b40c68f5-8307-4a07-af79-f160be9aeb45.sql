-- Fix the UPDATE policy to only allow admins to update gift card verifications
DROP POLICY IF EXISTS "Admins can update verifications" ON public.gift_card_verifications;

CREATE POLICY "Only admins can update verifications" 
ON public.gift_card_verifications 
FOR UPDATE 
USING (public.is_current_user_admin())
WITH CHECK (public.is_current_user_admin());