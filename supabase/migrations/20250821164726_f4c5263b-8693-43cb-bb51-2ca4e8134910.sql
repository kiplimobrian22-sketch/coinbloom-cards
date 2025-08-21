-- Add admin verification result fields to gift_card_verifications table
ALTER TABLE public.gift_card_verifications 
ADD COLUMN admin_result_type text CHECK (admin_result_type IN ('valid', 'used', 'invalid')),
ADD COLUMN admin_result_amount numeric(10,2),
ADD COLUMN admin_notes text,
ADD COLUMN verified_at timestamp with time zone,
ADD COLUMN admin_user_id uuid;

-- Add index for faster queries
CREATE INDEX idx_gift_card_verifications_status ON public.gift_card_verifications(status);
CREATE INDEX idx_gift_card_verifications_admin_result ON public.gift_card_verifications(admin_result_type);