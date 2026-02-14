
-- Create conversations table for Socratic guidance chats
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  problem_question TEXT NOT NULL,
  problem_student_answer TEXT NOT NULL,
  problem_correct_answer TEXT NOT NULL,
  problem_error_type TEXT,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  resolved BOOLEAN NOT NULL DEFAULT false,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Deny direct access (uses db-proxy like other tables)
CREATE POLICY "Deny direct access to conversations"
ON public.conversations
AS RESTRICTIVE
FOR ALL
USING (false)
WITH CHECK (false);
