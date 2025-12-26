-- Prevent all updates to leaderboard scores
CREATE POLICY "Prevent score updates" 
ON public.leaderboard 
FOR UPDATE 
USING (false);

-- Prevent all deletions from leaderboard
CREATE POLICY "Prevent score deletions" 
ON public.leaderboard 
FOR DELETE 
USING (false);