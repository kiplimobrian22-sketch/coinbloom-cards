-- Drop the existing policy
DROP POLICY IF EXISTS "Users can create gift card verifications" ON gift_card_verifications;

-- Create a new policy that allows both authenticated and guest users
CREATE POLICY "Users can create gift card verifications"
ON gift_card_verifications
FOR INSERT
WITH CHECK (
  -- Allow authenticated users to insert their own verifications
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  -- Allow guest users to insert verifications
  (auth.uid() IS NULL)
);