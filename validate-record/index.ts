// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_utils/cors.ts'

import Ajv from 'npm:ajv';
const ajv = new Ajv({
  allErrors: true,
  strict: false, // Disable strict mode to allow additional properties
  removeAdditional: true // Remove additional properties not defined in the schema
});

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

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

interface ValidationRequest {
  properties: Record<string, any>;
  previous_properties?: Record<string, any>; // Make optional with default
  validation_version: string;
}

interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

interface ValidationWarning {
  field: string;
  message: string;
  severity: 'warning' | 'info';
}

interface ValidationResponse {
  validation_errors: {
    error_count: number;
    errors: ValidationError[];
  };
  plausibility_errors: {
    warning_count: number;
    warnings: ValidationWarning[];
  };
}

Deno.serve(async (req: Request) => {

  // Add method check
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 405,
    })
  }

  try {

    const { properties, previous_properties, validation_version }: ValidationRequest = await req.json()

    if (!properties || !validation_version) {
      return new Response(JSON.stringify({ error: 'Invalid request payload' }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 400,
      })
    }

    

    let validation_errors = [];
    let plausibility_errors = [];

    try{
      const { data: schemaData, error: schemaError } = await supabase.storage.from('public').download(`validation/${validation_version}/validation.json`);
      if (schemaError) {
        console.error('Error downloading schema:', schemaError);
        return new Response(
          JSON.stringify({ error: 'Failed to download schema' }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )
      }
      // Validation
      const schema = await schemaData.text();
      const jsonSchema = JSON.parse(schema);
      ajv.compile(jsonSchema);

      const validate = ajv.compile(jsonSchema.properties.plot.items);
      const valid = validate(properties);
      if (!valid) {
        validation_errors.push(...(validate.errors || []));
      }

    } catch (error) {
      console.error('Error compiling schema:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to compile schema' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    //if(validation_errors.length === 0){
      try{
        // Plausibility check
        const { data: plausibilityData, error: plausibilityError } = await supabase.storage.from('public').download(`validation/${validation_version}/bundle.umd.js`);
        if (plausibilityError) {
          console.error('Error downloading plausibility script:', plausibilityError);
          return new Response(
            JSON.stringify({ error: `Failed to download: validation/${validation_version}/bundle.umd.js` }),
            { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          )
        }
        //const response = await fetch(`https://ci.thuenen.de/storage/v1/object/public/validation/${validation_version}/plausibility.umd.js`);
        //const script = await response.text();
        eval(plausibilityData);

        const tfm = new TFM();

        plausibility_errors = await tfm.runPlots([properties], null, [previous_properties]);

      } catch (error) {
        console.error('Error checking plausibility:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to check plausibility' }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )
      }
    //}

    /* Your validation logic here
    const validation_errors = await performValidation(properties, previous_properties)
    const plausibility_errors = await performPlausibilityCheck(properties, previous_properties)

    const response: ValidationResponse = {
      validation_errors,
      plausibility_errors
    }*/

    return new Response(JSON.stringify({
      validation_errors: validation_errors,
      plausibility_errors: plausibility_errors
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 200,
    })

  } catch (error) {
    console.error('Validation error:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      validation_errors: { error: 'Validation failed' },
      plausibility_errors: { error: 'Plausibility check failed' }
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 500,
    })
  }
})