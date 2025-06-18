// SMS API Configuration
// TODO: Replace with your actual SMS API credentials
const SMS_CONFIG = {
  API_KEY: 'YOUR_SMS_API_KEY',
  SENDER_ID: 'REBEARTH',
  BASE_URL: 'https://api.africastalking.com/version1/messaging', // Example using Africa's Talking
};

export interface SMSData {
  to: string;
  message: string;
}

// Send SMS notification
export const sendSMS = async (smsData: SMSData): Promise<any> => {
  try {
    const response = await fetch(SMS_CONFIG.BASE_URL, {
      method: 'POST',
      headers: {
        'apiKey': SMS_CONFIG.API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username: 'sandbox', // Replace with your username
        to: smsData.to,
        message: smsData.message,
        from: SMS_CONFIG.SENDER_ID,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error('Failed to send SMS:', error);
    throw error;
  }
};

// Send payment confirmation SMS
export const sendPaymentConfirmationSMS = async (
  phoneNumber: string,
  invoiceNumber: string,
  amount: number,
  mpesaCode: string
): Promise<void> => {
  const message = `Thank you for your payment! 
Invoice: ${invoiceNumber}
Amount: KES ${amount.toLocaleString()}
M-Pesa Code: ${mpesaCode}
Your order will be processed shortly.
- Rebearth Solutions Ltd`;

  await sendSMS({
    to: phoneNumber,
    message,
  });
};

export { SMS_CONFIG };