-- Drop existing tables with foreign keys to auth.users
DROP TABLE IF EXISTS public.notification_preferences CASCADE;
DROP TABLE IF EXISTS public.children CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate profiles table without foreign key to auth.users (for Firebase UIDs)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  full_name TEXT,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  onboarding_step INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create children table with TEXT user_id for Firebase
CREATE TABLE public.children (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id TEXT NOT NULL,
  name TEXT NOT NULL,
  grade INTEGER NOT NULL CHECK (grade >= 3 AND grade <= 5),
  avatar TEXT NOT NULL DEFAULT 'bear',
  learning_goals TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notification preferences table with TEXT user_id
CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  daily_progress BOOLEAN NOT NULL DEFAULT true,
  weekly_summary BOOLEAN NOT NULL DEFAULT true,
  homework_completed BOOLEAN NOT NULL DEFAULT true,
  learning_tips BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for faster lookups
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_children_parent_id ON public.children(parent_id);
CREATE INDEX idx_notification_preferences_user_id ON public.notification_preferences(user_id);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Since we're using Firebase auth, we'll use service role for backend operations
-- For now, create permissive policies for authenticated operations
-- In production, you'd want to verify Firebase tokens server-side

-- RLS policies for profiles (using anon key with user_id check in app code)
CREATE POLICY "Allow all operations on profiles"
ON public.profiles FOR ALL
USING (true)
WITH CHECK (true);

-- RLS policies for children
CREATE POLICY "Allow all operations on children"
ON public.children FOR ALL
USING (true)
WITH CHECK (true);

-- RLS policies for notification preferences
CREATE POLICY "Allow all operations on notification_preferences"
ON public.notification_preferences FOR ALL
USING (true)
WITH CHECK (true);

-- Recreate triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_children_updated_at
BEFORE UPDATE ON public.children
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
BEFORE UPDATE ON public.notification_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();