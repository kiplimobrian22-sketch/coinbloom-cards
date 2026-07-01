
-- Enable required extensions for scheduled HTTP calls
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remove any prior schedule with this name
DO $$
BEGIN
  PERFORM cron.unschedule('keep-alive-twice-weekly');
EXCEPTION WHEN OTHERS THEN
  -- ignore if it doesn't exist
  NULL;
END $$;

-- Schedule keep-alive: Mondays and Thursdays at 08:00 UTC
SELECT cron.schedule(
  'keep-alive-twice-weekly',
  '0 8 * * 1,4',
  $$
  SELECT net.http_post(
    url := 'https://xtenpennablsscizspsl.supabase.co/functions/v1/keep-alive',
    headers := '{"Content-Type": "application/json", "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0ZW5wZW5uYWJsc3NjaXpzcHNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODU5OTEsImV4cCI6MjA3MTM2MTk5MX0.Fv6Xd5Q_h_aVVBWgF_va2nwWMDyYtPvEef1yWRCK4WU"}'::jsonb,
    body := '{"trigger":"cron"}'::jsonb
  );
  $$
);
