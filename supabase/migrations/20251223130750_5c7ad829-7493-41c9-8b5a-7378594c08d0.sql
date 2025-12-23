-- Create leaderboard table for storing game scores
CREATE TABLE public.leaderboard (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    total_time_ms BIGINT NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view leaderboard
CREATE POLICY "Anyone can view leaderboard" 
ON public.leaderboard 
FOR SELECT 
USING (true);

-- Allow anyone to insert scores
CREATE POLICY "Anyone can insert scores" 
ON public.leaderboard 
FOR INSERT 
WITH CHECK (true);

-- Enable realtime for leaderboard table
ALTER PUBLICATION supabase_realtime ADD TABLE public.leaderboard;