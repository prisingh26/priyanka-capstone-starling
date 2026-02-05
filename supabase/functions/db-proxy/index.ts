 import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.10';
 
 const corsHeaders = {
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-firebase-token',
   'Access-Control-Allow-Methods': 'POST, OPTIONS', 
 };
 
 const FIREBASE_PROJECT_ID = 'sprout-learning-1f90c';
 
 function base64UrlDecode(str: string): string {
   str = str.replace(/-/g, '+').replace(/_/g, '/');
   while (str.length % 4) {
     str += '=';
   }
   return atob(str);
 }
 
 function verifyFirebaseToken(token: string): { uid: string; email?: string } | null {
   try {
     const parts = token.split('.');
     if (parts.length !== 3) return null;
 
     const payload = JSON.parse(base64UrlDecode(parts[1]));
     const now = Math.floor(Date.now() / 1000);
 
     // Check expiration
     if (!payload.exp || payload.exp < now) {
       console.log('Token expired');
       return null;
     }
 
     // Check issued at (with 60 second clock skew tolerance)
     if (!payload.iat || payload.iat > now + 60) {
       console.log('Invalid issued at time');
       return null;
     }
 
     // Check audience (must match our Firebase project ID)
     if (payload.aud !== FIREBASE_PROJECT_ID) {
       console.log('Invalid audience:', payload.aud);
       return null;
     }
 
     // Check issuer
     if (payload.iss !== `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`) {
       console.log('Invalid issuer:', payload.iss);
       return null;
     }
 
     // Check subject (user ID) exists
     if (!payload.sub || typeof payload.sub !== 'string') {
       console.log('Invalid subject');
       return null;
     }
 
     // Check auth_time is in the past
     if (!payload.auth_time || payload.auth_time > now + 60) {
       console.log('Invalid auth time');
       return null;
     }
 
     return { uid: payload.sub, email: payload.email };
   } catch (error) {
     console.error('Token verification error:', error);
     return null;
   }
 }
 
 Deno.serve(async (req) => {
   if (req.method === 'OPTIONS') {
     return new Response(null, { headers: corsHeaders });
   }
 
   try {
     // Get Firebase token from header
     const firebaseToken = req.headers.get('x-firebase-token');
     if (!firebaseToken) {
       return new Response(
         JSON.stringify({ error: 'Missing Firebase token' }),
         { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     // Verify Firebase token
     const user = verifyFirebaseToken(firebaseToken);
     if (!user) {
       return new Response(
         JSON.stringify({ error: 'Invalid Firebase token' }),
         { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     // Create Supabase admin client
     const supabaseAdmin = createClient(
       Deno.env.get('SUPABASE_URL')!,
       Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
     );
 
     const body = await req.json();
     const { operation, table, data, filters } = body;
 
     // Validate table name (whitelist)
     const allowedTables = ['profiles', 'children', 'notification_preferences'];
     if (!allowedTables.includes(table)) {
       return new Response(
         JSON.stringify({ error: 'Invalid table' }),
         { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     // Get the user ID column name based on table
     const userIdColumn = table === 'children' ? 'parent_id' : 'user_id';
 
     let result;
 
     switch (operation) {
       case 'select': {
         let query = supabaseAdmin.from(table).select(data?.columns || '*');
         
         // Always filter by user ID for security
         query = query.eq(userIdColumn, user.uid);
         
         // Apply additional filters
         if (filters) {
           for (const [key, value] of Object.entries(filters)) {
             if (key !== userIdColumn) { // Don't allow overriding user filter
               query = query.eq(key, value);
             }
           }
         }
         
         if (data?.single) {
           result = await query.single();
         } else {
           result = await query;
         }
         break;
       }
 
       case 'insert': {
         // Force the user ID to be the authenticated user
         const insertData = { ...data, [userIdColumn]: user.uid };
         result = await supabaseAdmin.from(table).insert(insertData).select();
         break;
       }
 
       case 'update': {
         if (!filters) {
           return new Response(
             JSON.stringify({ error: 'Update requires filters' }),
             { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
           );
         }
         
         // Always include user ID filter for security
         let query = supabaseAdmin.from(table).update(data).eq(userIdColumn, user.uid);
         
         for (const [key, value] of Object.entries(filters)) {
           if (key !== userIdColumn) {
             query = query.eq(key, value);
           }
         }
         
         result = await query.select();
         break;
       }
 
       case 'upsert': {
         // Force the user ID to be the authenticated user
         const upsertData = { ...data, [userIdColumn]: user.uid };
         result = await supabaseAdmin.from(table).upsert(upsertData).select();
         break;
       }
 
       case 'delete': {
         if (!filters) {
           return new Response(
             JSON.stringify({ error: 'Delete requires filters' }),
             { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
           );
         }
         
         let query = supabaseAdmin.from(table).delete().eq(userIdColumn, user.uid);
         
         for (const [key, value] of Object.entries(filters)) {
           if (key !== userIdColumn) {
             query = query.eq(key, value);
           }
         }
         
         result = await query;
         break;
       }
 
       default:
         return new Response(
           JSON.stringify({ error: 'Invalid operation' }),
           { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         );
     }
 
     return new Response(
       JSON.stringify(result),
       { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
 
   } catch (error) {
     console.error('Error:', error);
     return new Response(
       JSON.stringify({ error: 'Internal server error' }),
       { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
   }
 });