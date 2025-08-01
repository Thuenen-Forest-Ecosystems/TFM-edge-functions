// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

console.log("Webhook deployment server ready!")

Deno.serve(async (req) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    // Optional: verify webhook secret
    const signature = req.headers.get('x-hub-signature-256')
    const webhookSecret = Deno.env.get('WEBHOOK_SECRET')
    
    if (webhookSecret && signature) {
      const payload = await req.text()
      const expectedSignature = await generateSignature(payload, webhookSecret)
      
      if (signature !== expectedSignature) {
        console.error('Invalid webhook signature')
        return new Response('Invalid signature', { status: 401 })
      }
      
      // Parse the payload after verification
      const data = JSON.parse(payload)
      console.log('Webhook received from:', data.repository?.name || 'unknown')
    }

    // Execute deployment script
    console.log('Starting deployment...')
    const result = await executeDeploymentScript()
    
    console.log('Deployment output:', result.stdout)
    
    if (result.success) {
      return new Response('Deployment successful', { status: 200 })
    } else {
      console.error('Deployment failed:', result.stderr)
      return new Response('Deployment failed', { status: 500 })
    }

  } catch (error) {
    console.error('Deployment failed:', error)
    return new Response('Deployment failed', { status: 500 })
  }
})

async function executeDeploymentScript(): Promise<{success: boolean, stdout: string, stderr: string}> {
  const scriptPath = Deno.env.get('DEPLOY_SCRIPT_PATH') || '/path/to/deploy.sh'
  
  try {
    const command = new Deno.Command('bash', {
      args: [scriptPath],
      stdout: 'piped',
      stderr: 'piped'
    })
    
    const result = await command.output()
    const stdout = new TextDecoder().decode(result.stdout)
    const stderr = new TextDecoder().decode(result.stderr)
    
    return {
      success: result.code === 0,
      stdout,
      stderr
    }
    
  } catch (error) {
    return {
      success: false,
      stdout: '',
      stderr: error.message
    }
  }
}

async function generateSignature(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  const hashArray = Array.from(new Uint8Array(signature))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  return `sha256=${hashHex}`
}