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

  // Get authorization header and verify authentication
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: 'Missing authorization header' }),
      { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }

  // get data from request body
  let body;
  try {
    body = await req.json();
  } catch (error) {
    console.error('JSON parsing error:', error);
    return new Response(
      JSON.stringify({ error: 'Invalid JSON in request body' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }

  const cluster = body.cluster;

  if (!cluster || typeof cluster !== 'object') {
    return new Response(
      JSON.stringify({ error: 'Invalid request body structure' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
  if (!cluster || !cluster.plot || !Array.isArray(cluster.plot)) {
    return new Response(
      JSON.stringify({ error: 'Plot data is required and must be an array' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
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

  const { data, error } = await supabase.storage.from('schema').download('schema.json');
  if (error) {
    console.error('Error downloading schema:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to download schema' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }

  // Fetch eval http://127.0.0.1:54321/storage/v1/object/validation/validation.js
  const response = await fetch('https://ci.thuenen.de/storage/v1/object/validation/validation.js');
  const script = await response.text();
  eval(script);
  const tfm = new TFM();

  const errors = [];
  try {
    const schema = await data.text();
    const jsonSchema = JSON.parse(schema);
    if (!jsonSchema || !jsonSchema.properties || !jsonSchema.properties.plot) {
      return new Response(
        JSON.stringify({ error: 'Invalid schema format' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }
    // Compile the schema for validation
    const validate = ajv.compile(jsonSchema.properties.plot.items);

    
    for (const plot of cluster.plot) {
      if (!plot.id || typeof plot.id !== 'string') {
        errors.push({ error: 'Invalid plot id' });
        continue;
      }

      const intervalName = plot.interval_name;

      //If plotId && intervalName == null

      let previousPlot = null;
      
      if(intervalName && plot.cluster_name !== null && plot.plot_name != null) {
        const previousIntervalName = plot.interval_name === 'bwi2022' ? 'ci2017' : (plot.interval_name === 'ci2017' ? 'bwi2012' : null);

        const { data: plotData, error: plotError } = await supabase.
          schema('inventory_archive').
          from('plot').
          select('*, tree(*),deadwood(*),regeneration(*),structure_lt4m(*),structure_gt4m(*),edges(*),plot_landmark(*),position(*),subplots_relative_position(*)').
          eq('interval_name', previousIntervalName).
          eq('cluster_name', plot.cluster_name).
          eq('plot_name', plot.plot_name).
          maybeSingle();

        if (plotError) {
          errors.push({ error: plotError.message });
          continue;
        }
        previousPlot = plotData;
      }
      
      /*if(plot.id){

        const { data: previousPlotData, error: previousPlotError } = await supabase.rpc('get_plot_nested_json_by_id', { p_plot_id: plot.id });
        if (previousPlotError) {
          errors.push({ error: previousPlotError.message });
          continue;
        }
        previousPlot = previousPlotData;
        console.log(previousPlot);
      }*/

      const valid = validate(plot)
      if (!valid) {
        errors.push({ validation_errors: validate.errors });
      }

      const plausibilityErrors = await tfm.runPlots([plot], null, [previousPlot]);
      
      errors.push({
        validation_errors: validate.errors,
        plausibility_errors: plausibilityErrors
      });
    }

  }catch (error) {
    console.error('Error compiling schema:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to compile schema' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }

  // Return errors
  return new Response(
    JSON.stringify({ errors }),
    { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
  )

})