import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendSMS(to: string, message: string) {
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to, // Format: +919876543210
    });

    return {
      success: true,
      messageSid: result.sid,
    };
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
}
