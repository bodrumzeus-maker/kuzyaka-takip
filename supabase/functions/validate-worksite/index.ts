// Edge Function example for validating worksite data
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get JWT token and validate user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { worksiteId } = await req.json()

    // Get worksite data
    const { data: worksite, error } = await supabaseClient
      .from('worksites')
      .select('*')
      .eq('id', worksiteId)
      .single()

    if (error) throw error

    // Perform validation logic
    const validationResult = {
      isValid: true,
      warnings: [],
      errors: [],
    }

    // Check if budget is set
    if (!worksite.budget || worksite.budget <= 0) {
      validationResult.warnings.push('Bütçe belirlenmemiş')
    }

    // Check if dates are set
    if (!worksite.start_date) {
      validationResult.errors.push('Başlangıç tarihi belirlenmemiş')
      validationResult.isValid = false
    }

    // Check if end date is after start date
    if (worksite.start_date && worksite.end_date) {
      if (new Date(worksite.end_date) <= new Date(worksite.start_date)) {
        validationResult.errors.push('Bitiş tarihi başlangıç tarihinden önce olamaz')
        validationResult.isValid = false
      }
    }

    return new Response(JSON.stringify(validationResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
