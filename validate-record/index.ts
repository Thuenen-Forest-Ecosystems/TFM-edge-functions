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

    const { data: schemaData, error: schemaError } = await supabase.storage.from('public').download(`validation/${validation_version}/validation.json`);
    if (schemaError) {
      console.error('Error downloading schema:', schemaError);
      return new Response(
        JSON.stringify({ error: 'Failed to download schema' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    try{
      const schema = await schemaData.text();
      const jsonSchema = JSON.parse(schema);
      ajv.compile(jsonSchema);

      const validate = ajv.compile(jsonSchema.properties.plot.items);
      const valid = validate(properties);
      if (!valid) {
        return new Response(
          JSON.stringify({ error: 'Validation failed', details: validate.errors }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )
      }

    } catch (error) {
      console.error('Error compiling schema:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to compile schema' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    const response = await fetch(`https://ci.thuenen.de/storage/v1/object/public/validation/${validation_version}/bundle.umd.js`);
    const script = await response.text();
    eval(script);

    const tfm = new TFM();



    /* Your validation logic here
    const validation_errors = await performValidation(properties, previous_properties)
    const plausibility_errors = await performPlausibilityCheck(properties, previous_properties)

    const response: ValidationResponse = {
      validation_errors,
      plausibility_errors
    }*/

    return new Response(JSON.stringify(response), {
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

async function performValidation(properties: any, previous_properties: any) {
  // Implement your validation logic here
  const errors = []
  
  // Example validation rules
  if (!properties.measurement_date) {
    errors.push({ field: 'measurement_date', message: 'Measurement date is required' })
  }
  
  if (properties.dbh && properties.dbh < 0) {
    errors.push({ field: 'dbh', message: 'DBH cannot be negative' })
  }

  return {
    error_count: errors.length,
    errors: errors
  }
}

async function performPlausibilityCheck(properties: any, previous_properties: any) {
  // Implement your plausibility logic here
  const warnings = []
  
  // Example plausibility checks
  if (previous_properties.dbh && properties.dbh) {
    const growth = properties.dbh - previous_properties.dbh
    if (growth > 10) { // More than 10cm growth seems implausible
      warnings.push({ 
        field: 'dbh', 
        message: `Large DBH increase detected: ${growth}cm`,
        severity: 'warning'
      })
    }
  }

  return {
    warning_count: warnings.length,
    warnings: warnings
  }
}
