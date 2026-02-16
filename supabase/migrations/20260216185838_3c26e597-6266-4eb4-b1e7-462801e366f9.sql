
-- Create homework_scans table to persist AI analysis results
CREATE TABLE public.homework_scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  subject TEXT,
  topic TEXT,
  grade INTEGER,
  total_problems INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  analysis JSONB NOT NULL DEFAULT '{}'::jsonb,
  encouragement TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.homework_scans ENABLE ROW LEVEL SECURITY;

-- Deny direct access (use db-proxy)
CREATE POLICY "Deny direct access to homework_scans"
  ON public.homework_scans
  AS RESTRICTIVE
  FOR ALL
  USING (false)
  WITH CHECK (false);
