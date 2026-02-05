-- Drop the existing permissive policies
DROP POLICY IF EXISTS "Allow all operations on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow all operations on children" ON public.children;
DROP POLICY IF EXISTS "Allow all operations on notification_preferences" ON public.notification_preferences;

-- Create restrictive policies that deny all access via anon key
-- All data access now goes through the db-proxy edge function which uses service role
-- and enforces user ownership checks

-- Profiles: Deny all direct access (edge function uses service role to bypass)
CREATE POLICY "Deny direct access to profiles" 
ON public.profiles 
FOR ALL 
USING (false)
WITH CHECK (false);

-- Children: Deny all direct access
CREATE POLICY "Deny direct access to children" 
ON public.children 
FOR ALL 
USING (false)
WITH CHECK (false);

-- Notification Preferences: Deny all direct access
CREATE POLICY "Deny direct access to notification_preferences" 
ON public.notification_preferences 
FOR ALL 
USING (false)
WITH CHECK (false);