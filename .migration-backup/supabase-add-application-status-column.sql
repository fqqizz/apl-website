-- Add the application_status column to the players table.
-- Run this against your Supabase database.

ALTER TABLE public.players
ADD COLUMN IF NOT EXISTS application_status text NOT NULL DEFAULT 'UNDER REVIEW';

-- Optional: Create an index for faster lookups by application_status
CREATE INDEX IF NOT EXISTS idx_players_application_status ON public.players(application_status);