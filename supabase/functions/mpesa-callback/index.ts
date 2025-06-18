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

    const callbackData = await req.json()
    console.log('M-Pesa Callback received:', JSON.stringify(callbackData, null, 2))

    const stkCallback = callbackData.Body?.stkCallback
    if (!stkCallback) {
      throw new Error('Invalid callback data structure')
    }

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback

    // Update payment status based on result code
    const status = ResultCode === 0 ? 'completed' : 'failed'
    
    let mpesaReceiptNumber = null
    if (CallbackMetadata && CallbackMetadata.Item) {
      const receiptItem = CallbackMetadata.Item.find((item: any) => item.Name === 'MpesaReceiptNumber')
      mpesaReceiptNumber = receiptItem?.Value || null
    }

    // Update payment record
    const { data: payment, error: updateError } = await supabaseClient
      .from('payments')
      .update({
        status,
        mpesa_receipt_number: mpesaReceiptNumber,
        updated_at: new Date().toISOString()
      })
      .eq('transaction_id', CheckoutRequestID)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating payment:', updateError)
      throw updateError
    }

    // If payment is successful, update invoice status
    if (status === 'completed' && payment) {
      const { error: invoiceError } = await supabaseClient
        .from('invoices')
        .update({
          status: 'paid',
          updated_at: new Date().toISOString()
        })
        .eq('invoice_number', payment.invoice_id)

      if (invoiceError) {
        console.error('Error updating invoice:', invoiceError)
      }
    }

    console.log('Payment updated successfully:', payment)

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
    console.error('Error processing M-Pesa callback:', error)
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