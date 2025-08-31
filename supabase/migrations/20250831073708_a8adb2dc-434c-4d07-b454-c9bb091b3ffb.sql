-- Fix critical security vulnerability in gift_card_verifications table
-- Remove anonymous access to sensitive verification data

-- Drop the existing insecure SELECT policy
DROP POLICY IF EXISTS "Users can view their own verifications" ON public.gift_card_verifications;

-- Create a secure SELECT policy that only allows authenticated users to view their own verifications
CREATE POLICY "Authenticated users can view their own verifications" 
ON public.gift_card_verifications 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Also update the INSERT policy to be more explicit about authentication
DROP POLICY IF EXISTS "Anyone can create gift card verifications" ON public.gift_card_verifications;

-- Allow both authenticated and guest users to create verifications
-- But ensure proper user_id is set during insertion
CREATE POLICY "Users can create gift card verifications" 
ON public.gift_card_verifications 
FOR INSERT 
WITH CHECK (
  -- Allow authenticated users to insert with their own user_id
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) 
  OR 
  -- Allow guest users (auth.uid() IS NULL) to insert with any user_id (guest ID)
  (auth.uid() IS NULL)
);

-- Keep the admin-only UPDATE policy for security
-- Update the UPDATE policy to properly allow admins to update verifications
DROP POLICY IF EXISTS "Only admins can update verifications" ON public.gift_card_verifications;

CREATE POLICY "Admins can update verifications" 
ON public.gift_card_verifications 
FOR UPDATE 
USING (
  -- This will need to be updated when admin roles are implemented
  -- For now, no updates are allowed (same as before)
  false
);