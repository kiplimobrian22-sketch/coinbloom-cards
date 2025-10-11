-- Drop existing INSERT policy
DROP POLICY IF EXISTS "Allow all inserts" ON gift_card_verifications;

-- Create a completely open INSERT policy for public role
CREATE POLICY "Public can insert verifications"
ON gift_card_verifications
FOR INSERT
TO public
WITH CHECK (true);