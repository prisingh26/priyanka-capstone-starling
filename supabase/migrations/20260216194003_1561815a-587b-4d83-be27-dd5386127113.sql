
-- Create practice_sessions table to store practice session data
CREATE TABLE public.practice_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  grade INTEGER NOT NULL,
  total_problems INTEGER NOT NULL DEFAULT 0,
  correct_first_try INTEGER NOT NULL DEFAULT 0,
  incorrect_count INTEGER NOT NULL DEFAULT 0,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;

-- Deny direct access (all access via db-proxy)
CREATE POLICY "Deny direct access to practice_sessions"
  ON public.practice_sessions
  AS RESTRICTIVE
  FOR ALL
  USING (false)
  WITH CHECK (false);
