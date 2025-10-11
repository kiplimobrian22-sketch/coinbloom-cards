-- First, ensure RLS is enabled
ALTER TABLE gift_card_verifications ENABLE ROW LEVEL SECURITY;

-- Grant all necessary permissions
GRANT ALL ON gift_card_verifications TO postgres;
GRANT ALL ON gift_card_verifications TO anon;
GRANT ALL ON gift_card_verifications TO authenticated;
GRANT ALL ON gift_card_verifications TO service_role;

-- Drop all existing policies and recreate them
DROP POLICY IF EXISTS "Allow all inserts on gift_card_verifications" ON gift_card_verifications;
DROP POLICY IF EXISTS "Users can view their own verifications or admins can view all" ON gift_card_verifications;
DROP POLICY IF EXISTS "Only admins can update verifications" ON gift_card_verifications;

-- Create INSERT policy - allow anyone (authenticated or anon)
CREATE POLICY "Allow all inserts"
ON gift_card_verifications
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create SELECT policy - users can view their own, admins can view all
CREATE POLICY "Allow select for users and admins"
ON gift_card_verifications
FOR SELECT
TO anon, authenticated
USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) 
  OR is_current_user_admin()
);

-- Create UPDATE policy - only admins can update
CREATE POLICY "Only admins can update"
ON gift_card_verifications
FOR UPDATE
TO authenticated
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());