-- Drop the existing policy
DROP POLICY IF EXISTS "Users can create gift card verifications" ON gift_card_verifications;

-- Create a PERMISSIVE policy that allows guest submissions
CREATE POLICY "Users can create gift card verifications"
ON gift_card_verifications
AS PERMISSIVE
FOR INSERT
TO public
WITH CHECK (true);