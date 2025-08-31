-- First, update existing data to use proper status values
UPDATE public.gift_card_verifications 
SET status = LOWER(status) 
WHERE status IN ('PENDING', 'VALID', 'INVALID', 'USED');

-- Create exchange_requests table for sell/exchange functionality
CREATE TABLE public.exchange_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  type TEXT NOT NULL CHECK (type IN ('exchange', 'sell')),
  email TEXT NOT NULL,
  
  -- Gift card details
  giftcard_name TEXT NOT NULL,
  giftcard_wanted TEXT, -- For exchange requests
  amount TEXT NOT NULL,
  code TEXT NOT NULL,
  pin TEXT,
  country TEXT,
  
  -- Payment details (for sell requests)
  payment_method TEXT,
  payment_details JSONB,
  
  -- Image paths
  front_image_path TEXT,
  back_image_path TEXT,
  
  -- Status and admin fields
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'valid', 'invalid', 'used')),
  admin_result_type TEXT CHECK (admin_result_type IN ('valid', 'invalid', 'used')),
  admin_result_amount NUMERIC(10,2),
  admin_notes TEXT,
  admin_user_id UUID,
  verified_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on exchange_requests
ALTER TABLE public.exchange_requests ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view their own exchange requests
CREATE POLICY "Authenticated users can view their own exchange requests" 
ON public.exchange_requests 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Allow both authenticated and guest users to create exchange requests
CREATE POLICY "Users can create exchange requests" 
ON public.exchange_requests 
FOR INSERT 
WITH CHECK (
  -- Allow authenticated users to insert with their own user_id
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) 
  OR 
  -- Allow guest users (auth.uid() IS NULL) to insert with any user_id (guest ID)
  (auth.uid() IS NULL)
);

-- Admins can update exchange requests (will be updated when admin roles are implemented)
CREATE POLICY "Admins can update exchange requests" 
ON public.exchange_requests 
FOR UPDATE 
USING (false); -- No updates allowed for now, will be updated with admin roles

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_exchange_requests_updated_at
BEFORE UPDATE ON public.exchange_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update gift_card_verifications status field to use proper enum values
-- Add constraint to ensure status uses proper values
ALTER TABLE public.gift_card_verifications 
DROP CONSTRAINT IF EXISTS gift_card_verifications_status_check;

ALTER TABLE public.gift_card_verifications 
ADD CONSTRAINT gift_card_verifications_status_check 
CHECK (status IN ('pending', 'valid', 'invalid', 'used'));

-- Update admin_result_type constraint
ALTER TABLE public.gift_card_verifications 
DROP CONSTRAINT IF EXISTS gift_card_verifications_admin_result_type_check;

ALTER TABLE public.gift_card_verifications 
ADD CONSTRAINT gift_card_verifications_admin_result_type_check 
CHECK (admin_result_type IN ('valid', 'invalid', 'used'));