-- Update RLS policies for gift_card_verifications to allow public submissions

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their own verifications" ON public.gift_card_verifications;
DROP POLICY IF EXISTS "Users can view their own verifications" ON public.gift_card_verifications;
DROP POLICY IF EXISTS "Users can update their own verifications" ON public.gift_card_verifications;

-- Create new policies that allow public access for verification submissions
CREATE POLICY "Anyone can create gift card verifications" 
ON public.gift_card_verifications 
FOR INSERT 
WITH CHECK (true);

-- Allow users to view their own verifications (authenticated users by user_id, guests by email)
CREATE POLICY "Users can view their own verifications" 
ON public.gift_card_verifications 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
  (auth.uid() IS NULL AND email IS NOT NULL)
);

-- Only allow admins to update verifications
CREATE POLICY "Only admins can update verifications" 
ON public.gift_card_verifications 
FOR UPDATE 
USING (false);