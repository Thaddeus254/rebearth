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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const confirmationData = await req.json()
    console.log('M-Pesa Confirmation received:', JSON.stringify(confirmationData, null, 2))

    // Extract confirmation data
    const {
      TransactionType,
      TransID,
      TransTime,
      TransAmount,
      BusinessShortCode,
      BillRefNumber,
      InvoiceNumber,
      OrgAccountBalance,
      ThirdPartyTransID,
      MSISDN,
      FirstName,
      MiddleName,
      LastName
    } = confirmationData

    // Log the transaction for record keeping
    console.log('Transaction confirmed:', {
      TransID,
      Amount: TransAmount,
      Phone: MSISDN,
      InvoiceNumber: BillRefNumber,
      Time: TransTime
    })

    // You can store this confirmation data in your database if needed
    // This is separate from the STK push callback

    return new Response(
      JSON.stringify({
        ResultCode: '0',
        ResultDesc: 'Accepted'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in M-Pesa confirmation:', error)
    return new Response(
      JSON.stringify({
        ResultCode: 'C2B00011',
        ResultDesc: 'Rejected'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  }
})