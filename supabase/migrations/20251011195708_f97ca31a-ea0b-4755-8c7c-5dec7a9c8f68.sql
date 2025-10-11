-- Grant INSERT permission to both authenticated and anonymous users
GRANT INSERT ON gift_card_verifications TO anon;
GRANT INSERT ON gift_card_verifications TO authenticated;

-- Drop all existing INSERT policies
DROP POLICY IF EXISTS "Users can create gift card verifications" ON gift_card_verifications;

-- Create a single PERMISSIVE policy that allows all inserts
CREATE POLICY "Allow all inserts on gift_card_verifications"
ON gift_card_verifications
AS PERMISSIVE
FOR INSERT
TO public
WITH CHECK (true);