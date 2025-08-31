-- Create storage policies for gift-card-images bucket to allow public uploads

-- Allow public uploads to gift-card-images bucket
CREATE POLICY "Anyone can upload gift card images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'gift-card-images');

-- Allow users to view gift card images
CREATE POLICY "Users can view gift card images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'gift-card-images');