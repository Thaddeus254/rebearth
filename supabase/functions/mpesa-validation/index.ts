import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const validationData = await req.json()
    console.log('M-Pesa Validation received:', JSON.stringify(validationData, null, 2))

    // Extract validation data
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
    } = validationData

    // Perform validation logic here
    // For example, check if the BillRefNumber (invoice number) exists
    // Check if the amount is correct, etc.

    // For now, we'll accept all transactions
    // You can add your custom validation logic here

    console.log('Validation successful for transaction:', TransID)

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
    console.error('Error in M-Pesa validation:', error)
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