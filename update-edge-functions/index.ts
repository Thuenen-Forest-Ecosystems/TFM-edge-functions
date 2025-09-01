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

    // GitHub webhook signature verification
    const githubSignature = req.headers.get('x-hub-signature-256');

    if (!githubSignature || !webhook_token) {
        return new Response(
            JSON.stringify({ error: 'Unauthorized - missing signature or token' }), 
            { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
    }

    try {
        // Verify GitHub webhook signature
        const body = await req.text();
        const encoder = new TextEncoder();
        const keyData = encoder.encode(webhook_token);
        const messageData = encoder.encode(body);
        
        const key = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );
        
        const signature = await crypto.subtle.sign('HMAC', key, messageData);
        const expectedSignature = 'sha256=' + Array.from(new Uint8Array(signature))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        if (githubSignature !== expectedSignature) {
            return new Response(
                JSON.stringify({ error: 'Invalid signature' }), 
                { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
            );
        }

        // Execute git pull and container restart
        await pullLatestChanges();
        await restartDockerContainer();

        return new Response(
            JSON.stringify({ success: true, message: 'Successfully updated and restarted containers' }),
            { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );

    } catch (error) {
        console.error('Webhook processing failed:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error', details: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
    }
});