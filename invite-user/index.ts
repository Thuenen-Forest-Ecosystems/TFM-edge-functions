// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_utils/cors.ts'

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get authorization header and verify authentication
    const authHeader = req.headers.get('Authorization')!
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders} }
      )
    }

    // Create a client with the user's JWT
    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )


    const token = authHeader.replace('Bearer ', '')
    const { data:userData, error:userError } = await supabase.auth.getUser(token)

    if (userError || !userData.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // Parse request body
    const { email, metaData } = await req.json()
    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }
    if (!metaData || typeof metaData !== 'object') {
      return new Response(
        JSON.stringify({ error: 'MetaData is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    let newUserID = null;

    // Check if user already exists (to avoid multiple invitations)
    console.log('Checking if user exists:', email);
    
    // Query the users_profile table to check if user exists
    const { data: existingProfile, error: profileCheckError } = await supabase
      .schema('auth')
      .from('email')
      .select('id, email')
      .eq('email', email)
      .maybeSingle();
    
    if (profileCheckError) {
      console.error('Error checking existing user:', {
        error: profileCheckError,
        message: profileCheckError.message,
        email: email
      });
      return new Response(
        JSON.stringify({ error: 'Failed to check existing user', details: profileCheckError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    if (existingProfile) {
      // User already exists, no need to invite
      console.log('User already exists:', {
        id: existingProfile.id,
        email: existingProfile.email
      });
      newUserID = existingProfile.id;
    } else {
      // Generate the invitation link
      console.log('Inviting new user:', {
        email: email,
        redirectTo: 'https://thuenen-forest-ecosystems.github.io/TFM-Documentation/authentication/set-password',
        metaData: metaData
      });
      
      const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
        redirectTo: 'https://thuenen-forest-ecosystems.github.io/TFM-Documentation/authentication/set-password',
        data: {
          invited_by: userData.user.id,
          name: metaData.name || null,
          ...metaData
        }
      });
      
      if (error) {
        console.error('Failed to send invitation:', {
          error: error,
          message: error.message,
          status: error.status,
          name: error.name,
          email: email,
          metaData: metaData
        });
        return new Response(
          JSON.stringify({ 
            error: 'Failed to send invitation', 
            details: error.message,
            errorName: error.name,
            errorStatus: error.status
          }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
      
      console.log('Invitation sent successfully:', {
        userId: data.user.id,
        email: data.user.email
      });
      newUserID = data.user.id;

      // Verify the user was created
      const { data: userCheck, error: userCheckError } = await supabase.auth.admin.getUserById(newUserID);
      if (userCheckError || !userCheck) {
        console.error('User does not exist:', userCheckError);
        return new Response(
          JSON.stringify({ error: 'User does not exist in the system' }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      // NEW: Insert into users_profile for the new user (before permissions)
      const { error: profileError } = await supabase
        .from('users_profile')
        .insert({
          id: newUserID,
          email: email,
          organization_id: metaData.organization_id,
          user_name: metaData.name,
          is_organization_admin: metaData.is_organization_admin || false
        });

      if (profileError) {
        console.error('Error inserting into users_profile:', profileError);
        return new Response(
          JSON.stringify({ error: 'Failed to create user profile', details: profileError.message }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
    }

    // Add public.users_permissions (now safe, as users_profile exists)
    if (newUserID && metaData.organization_id) {
      try {
        const { data: permissionData, error: permissionError } = await supabase
          .from('users_permissions')
          .insert({
            user_id: newUserID,
            organization_id: metaData.organization_id,
            created_by: userData.user.id,
            is_organization_admin: metaData.is_organization_admin || false
          })
          .select();

        if (permissionError) {
          console.error('Error inserting into users_permissions:', permissionError, {
            organization_id: metaData.organization_id,
            created_by: userData.user.id
          });
          return new Response(
            JSON.stringify({ error: 'Failed to insert into users_permissions', details: permissionError.message }),
            { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          );
        }
      } catch (e) {
        console.error('Unexpected error during insertion:', e);
        return new Response(
          JSON.stringify({ error: 'Unexpected error during insertion', details: e.message }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
    } else {
      console.warn('No organization_id provided, skipping users_permissions insertion');
    }


    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Invitation sent to ${email}` 
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )

  } catch (error) {
    console.error('Error processing invitation:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/invite-user' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"email":"gerrit.balindt@gruenecho.de"}'

*/
