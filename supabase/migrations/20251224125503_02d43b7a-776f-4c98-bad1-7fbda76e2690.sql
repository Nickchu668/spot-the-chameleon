-- Add level and mistakes columns to leaderboard
ALTER TABLE public.leaderboard 
ADD COLUMN level INTEGER NOT NULL DEFAULT 1,
ADD COLUMN mistakes INTEGER NOT NULL DEFAULT 0;