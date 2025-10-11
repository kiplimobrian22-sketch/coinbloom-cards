-- Make user_id nullable to allow guest submissions
ALTER TABLE gift_card_verifications 
ALTER COLUMN user_id DROP NOT NULL;