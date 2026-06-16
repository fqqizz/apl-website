-- Add the new player_id column to the players table.
-- Run this against your Supabase database.

ALTER TABLE public.players
ADD COLUMN IF NOT EXISTS player_id text;

-- Enforce uniqueness at the database layer for generated player IDs.
CREATE UNIQUE INDEX IF NOT EXISTS idx_players_player_id_unique
ON public.players(player_id);
