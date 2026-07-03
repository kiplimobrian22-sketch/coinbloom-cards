
-- Enable pg_cron extension to schedule keepalive activity
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Keepalive table with a single heartbeat row
CREATE TABLE IF NOT EXISTS public.keepalive (
  id INTEGER PRIMARY KEY DEFAULT 1,
  last_ping TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT keepalive_singleton CHECK (id = 1)
);

GRANT SELECT ON public.keepalive TO anon, authenticated;
GRANT ALL ON public.keepalive TO service_role;

ALTER TABLE public.keepalive ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Keepalive readable by everyone" ON public.keepalive;
CREATE POLICY "Keepalive readable by everyone"
ON public.keepalive FOR SELECT
USING (true);

INSERT INTO public.keepalive (id, last_ping)
VALUES (1, now())
ON CONFLICT (id) DO NOTHING;

-- Remove any prior schedule with the same name
SELECT cron.unschedule(jobid) FROM cron.job WHERE jobname = 'keepalive-biweekly';

-- Run twice a week (Monday and Thursday at 12:00 UTC) to prevent auto-pause
SELECT cron.schedule(
  'keepalive-biweekly',
  '0 12 * * 1,4',
  $$UPDATE public.keepalive SET last_ping = now() WHERE id = 1;$$
);
