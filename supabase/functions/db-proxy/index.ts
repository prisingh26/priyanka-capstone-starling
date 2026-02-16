import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.10';
import { jwtVerify, createRemoteJWKSet } from 'https://esm.sh/jose@5.2.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-firebase-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS', 
};

const FIREBASE_PROJECT_ID = 'sprout-learning-1f90c';

const JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
);

async function verifyFirebaseToken(token: string): Promise<{ uid: string; email?: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
      audience: FIREBASE_PROJECT_ID,
    });

    if (!payload.sub || typeof payload.sub !== 'string') {
      console.log('Invalid subject');
      return null;
    }

    return { uid: payload.sub, email: payload.email as string | undefined };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const firebaseToken = req.headers.get('x-firebase-token');
    if (!firebaseToken) {
      return new Response(
        JSON.stringify({ error: 'Missing Firebase token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const user = await verifyFirebaseToken(firebaseToken);
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Invalid Firebase token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const body = await req.json();
    const { operation, table, data, filters, match } = body;

    // Validate table name (whitelist)
    const allowedTables = ['profiles', 'children', 'notification_preferences', 'conversations', 'homework_scans'];
    if (!allowedTables.includes(table)) {
      return new Response(
        JSON.stringify({ error: 'Invalid table' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate operation (whitelist)
    const allowedOperations = ['select', 'insert', 'update', 'upsert', 'delete'];
    if (!allowedOperations.includes(operation)) {
      return new Response(
        JSON.stringify({ error: 'Invalid operation' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userIdColumn = table === 'children' ? 'parent_id' : 'user_id';

    let result;

    switch (operation) {
      case 'select': {
        let query = supabaseAdmin.from(table).select(data?.columns || '*');
        query = query.eq(userIdColumn, user.uid);
        if (filters) {
          for (const [key, value] of Object.entries(filters)) {
            if (key !== userIdColumn) {
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
        const insertData = { ...data, [userIdColumn]: user.uid };
        result = await supabaseAdmin.from(table).insert(insertData).select();
        break;
      }

      case 'update': {
        const updateFilters = match || filters;
        if (!updateFilters) {
          return new Response(
            JSON.stringify({ error: 'Update requires filters or match' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        let query = supabaseAdmin.from(table).update(data).eq(userIdColumn, user.uid);
        for (const [key, value] of Object.entries(updateFilters)) {
          if (key !== userIdColumn) {
            query = query.eq(key, value as string);
          }
        }
        result = await query.select();
        break;
      }

      case 'upsert': {
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
