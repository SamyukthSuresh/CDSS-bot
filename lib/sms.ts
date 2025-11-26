import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } from '@/config';
export async function sendSMS(to: string, message: string) {
  const accountSid = TWILIO_ACCOUNT_SID;
  const authToken = TWILIO_AUTH_TOKEN;
  const from = TWILIO_PHONE_NUMBER;

  // Validate environment variables
   if (!accountSid || !authToken || !from) {
    throw new Error('Missing Twilio credentials in environment variables');
  }

  // Create base64 auth string
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: to,
          From: String(from),
          Body: message,
        }).toString(),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send SMS');
    }

    return {
      success: true,
      messageSid: data.sid,
    };
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
}
