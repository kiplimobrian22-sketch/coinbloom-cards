-- Fix RLS policy for gift_card_verifications to allow guest users
DROP POLICY IF EXISTS "Users can create gift card verifications" ON gift_card_verifications;

CREATE POLICY "Users can create gift card verifications" 
ON gift_card_verifications 
FOR INSERT 
WITH CHECK (
  -- Allow authenticated users to insert their own records
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) 
  OR 
  -- Allow guest users (non-authenticated) to insert records
  (auth.uid() IS NULL)
);