/**
 * Listen for incoming github-webhook requests
 * Pull the latest changes from the repository
 * Restart docker containers
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { corsHeaders } from '../_utils/cors.ts'
import { pullLatestChanges, restartDockerContainer } from '../_utils/docker.ts'


const webhook_token = Deno.env.get('WEBHOOK_TOKEN') || ''

Deno.serve(async (req) => {

    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    // POST requests only
    if (req.method !== 'POST') {
        return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )
    }

    // const signature = req.headers["x-hub-signature-256"];
    const githubSignature = req.headers.get('x-hub-signature');

    if(!githubSignature || githubSignature !== webhook_token) {
        return new Response("Unauthorized", { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    await pullLatestChanges();
    await restartDockerContainer();

    return new Response("Method not allowed", { status: 405 });
});