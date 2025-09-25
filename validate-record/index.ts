// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

interface ValidationRequest {
  properties: Record<string, any>;
  previous_properties?: Record<string, any>; // Make optional with default
  validation_version: string;
  record_id: string;
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
      headers: { 'Content-Type': 'application/json' },
      status: 405,
    })
  }

  try {
    const body = await req.json()
  
    // Validate required fields
    if (!body.properties || !body.record_id || !body.validation_version) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: properties, record_id, validation_version',
        validation_errors: { error: 'Invalid request' },
        plausibility_errors: { error: 'Invalid request' }
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const { properties, previous_properties, validation_version, record_id }: ValidationRequest = await req.json()

    console.log(`Validating record ${record_id} with validation_version ${validation_version}`)

    // Your validation logic here
    const validation_errors = await performValidation(properties, previous_properties)
    const plausibility_errors = await performPlausibilityCheck(properties, previous_properties)

    const response: ValidationResponse = {
      validation_errors,
      plausibility_errors
    }

    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Validation error:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      validation_errors: { error: 'Validation failed' },
      plausibility_errors: { error: 'Plausibility check failed' }
    }), {
      headers: { 'Content-Type': 'application/json' },
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
