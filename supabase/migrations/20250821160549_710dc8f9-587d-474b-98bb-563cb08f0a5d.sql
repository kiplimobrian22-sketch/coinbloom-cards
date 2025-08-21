-- Create gift card verifications table
CREATE TABLE public.gift_card_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  country TEXT NOT NULL,
  giftcard_name TEXT NOT NULL,
  code TEXT NOT NULL,
  pin TEXT,
  amount TEXT NOT NULL,
  email TEXT NOT NULL,
  front_image_path TEXT,
  back_image_path TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gift_card_verifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own verifications" 
ON public.gift_card_verifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own verifications" 
ON public.gift_card_verifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own verifications" 
ON public.gift_card_verifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create storage bucket for gift card images
INSERT INTO storage.buckets (id, name, public) VALUES ('gift-card-images', 'gift-card-images', false);

-- Create storage policies for gift card images
CREATE POLICY "Users can view their own gift card images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'gift-card-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own gift card images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'gift-card-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_gift_card_verifications_updated_at
BEFORE UPDATE ON public.gift_card_verifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();