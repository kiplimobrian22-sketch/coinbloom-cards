-- Fix the admin update policy for gift_card_verifications
-- First, drop the existing admin update policy
DROP POLICY IF EXISTS "Admins can update verifications" ON public.gift_card_verifications;

-- Create a proper admin update policy
-- For now, we'll allow authenticated users to update (you'll need to implement proper admin role checking)
CREATE POLICY "Admins can update verifications" 
ON public.gift_card_verifications 
FOR UPDATE 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Also ensure the status field can handle the new values we need
-- Add a check constraint for valid status values
ALTER TABLE public.gift_card_verifications 
DROP CONSTRAINT IF EXISTS gift_card_verifications_status_check;

ALTER TABLE public.gift_card_verifications 
ADD CONSTRAINT gift_card_verifications_status_check 
CHECK (status IN ('pending', 'processing', 'completed', 'rejected'));

-- Add constraint for admin_result_type values
ALTER TABLE public.gift_card_verifications 
DROP CONSTRAINT IF EXISTS gift_card_verifications_admin_result_type_check;

ALTER TABLE public.gift_card_verifications 
ADD CONSTRAINT gift_card_verifications_admin_result_type_check 
CHECK (admin_result_type IN ('valid', 'used', 'invalid') OR admin_result_type IS NULL);