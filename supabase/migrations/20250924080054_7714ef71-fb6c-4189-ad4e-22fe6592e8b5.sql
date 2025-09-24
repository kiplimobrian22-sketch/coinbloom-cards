-- Add admin role to profiles table
ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT false;

-- Create an admin policy for gift_card_verifications that allows admins to see all verifications
CREATE POLICY "Admins can view all verifications" 
ON public.gift_card_verifications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_admin = true
  )
);

-- Update the existing SELECT policy to be more permissive for admins
DROP POLICY IF EXISTS "Authenticated users can view their own verifications" ON public.gift_card_verifications;

CREATE POLICY "Users can view their own verifications or admins can view all" 
ON public.gift_card_verifications 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) 
  OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_admin = true
  )
);