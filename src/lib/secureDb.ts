 import { auth } from '@/lib/firebase';
 
 const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
 const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
 
 type DbTable = 'profiles' | 'children' | 'notification_preferences' | 'conversations' | 'homework_scans' | 'practice_sessions';
 type DbOperation = 'select' | 'insert' | 'update' | 'upsert' | 'delete';
 
 interface DbRequest {
   operation: DbOperation;
   table: DbTable;
   data?: Record<string, unknown>;
   filters?: Record<string, unknown>;
 }
 
 interface DbResponse<T = unknown> {
   data: T | null;
   error: { message: string } | null;
 }
 
 async function getFirebaseToken(): Promise<string | null> {
   const user = auth.currentUser;
   if (!user) return null;
   
   try {
     return await user.getIdToken();
   } catch (error) {
     console.error('Failed to get Firebase token:', error);
     return null;
   }
 }
 
 async function secureDbRequest<T = unknown>(request: DbRequest): Promise<DbResponse<T>> {
   const token = await getFirebaseToken();
   
   if (!token) {
     return { data: null, error: { message: 'User not authenticated' } };
   }
 
   try {
     const response = await fetch(`${SUPABASE_URL}/functions/v1/db-proxy`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'apikey': SUPABASE_ANON_KEY,
         'x-firebase-token': token,
       },
       body: JSON.stringify(request),
     });
 
     if (!response.ok) {
       const errorBody = await response.json().catch(() => ({ error: 'Unknown error' }));
       return { data: null, error: { message: errorBody.error || response.statusText } };
     }
 
     const result = await response.json();
     return result;
   } catch (error) {
     console.error('Secure DB request failed:', error);
     return { data: null, error: { message: 'Network error' } };
   }
 }
 
 // Secure database operations
 export const secureDb = {
   // Profiles
   profiles: {
     async get() {
       return secureDbRequest<{ id: string; user_id: string; full_name: string | null; onboarding_completed: boolean; onboarding_step: number }[]>({
         operation: 'select',
         table: 'profiles',
         data: { single: true },
       });
     },
     
     async create(data: { full_name?: string; onboarding_completed?: boolean; onboarding_step?: number }) {
       return secureDbRequest({
         operation: 'insert',
         table: 'profiles',
         data,
       });
     },
     
     async update(data: { full_name?: string; onboarding_completed?: boolean; onboarding_step?: number }) {
       return secureDbRequest({
         operation: 'update',
         table: 'profiles',
         data,
         filters: {}, // Will be filtered by user_id in the edge function
       });
     },
     
     async upsert(data: { full_name?: string; onboarding_completed?: boolean; onboarding_step?: number }) {
       return secureDbRequest({
         operation: 'upsert',
         table: 'profiles',
         data,
       });
     },
   },
 
   // Children
   children: {
     async list() {
       return secureDbRequest<{ id: string; parent_id: string; name: string; grade: number; avatar: string; learning_goals: string | null }[]>({
         operation: 'select',
         table: 'children',
       });
     },
     
     async create(data: { name: string; grade: number; avatar: string; learning_goals?: string | null }) {
       return secureDbRequest({
         operation: 'insert',
         table: 'children',
         data,
       });
     },
     
     async update(id: string, data: { name?: string; grade?: number; avatar?: string; learning_goals?: string | null }) {
       return secureDbRequest({
         operation: 'update',
         table: 'children',
         data,
         filters: { id },
       });
     },
     
     async delete(id: string) {
       return secureDbRequest({
         operation: 'delete',
         table: 'children',
         filters: { id },
       });
     },
   },
 
   // Notification Preferences
   notificationPreferences: {
     async get() {
       return secureDbRequest<{ id: string; user_id: string; daily_progress: boolean; weekly_summary: boolean; homework_completed: boolean; learning_tips: boolean }[]>({
         operation: 'select',
         table: 'notification_preferences',
         data: { single: true },
       });
     },
     
     async create(data: { daily_progress?: boolean; weekly_summary?: boolean; homework_completed?: boolean; learning_tips?: boolean }) {
       return secureDbRequest({
         operation: 'insert',
         table: 'notification_preferences',
         data,
       });
     },
     
     async update(data: { daily_progress?: boolean; weekly_summary?: boolean; homework_completed?: boolean; learning_tips?: boolean }) {
       return secureDbRequest({
         operation: 'update',
         table: 'notification_preferences',
         data,
         filters: {},
       });
     },
     
     async upsert(data: { daily_progress?: boolean; weekly_summary?: boolean; homework_completed?: boolean; learning_tips?: boolean }) {
       return secureDbRequest({
         operation: 'upsert',
         table: 'notification_preferences',
         data,
       });
     },
   },
 };