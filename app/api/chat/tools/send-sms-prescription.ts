import { tool } from 'ai';
import { z } from 'zod';
import { sendSMS } from '@/lib/sms';

export const sendSMSPrescription = tool({
  description: 'Send prescription to patient via SMS. Use this after generating a prescription.',
  inputSchema: z.object({
    phoneNumber: z.string().describe('Patient phone number with country code (e.g., +919876543210)'),
    prescription: z.string().describe('The complete prescription text to send'),
  }),
  execute: async ({ phoneNumber, prescription }) => {
    try {
      // Keep SMS under 1600 chars (Twilio limit)
      const truncatedPrescription = prescription.length > 1500 
        ? prescription.substring(0, 1500) + '...'
        : prescription;

      const result = await sendSMS(phoneNumber, truncatedPrescription);

      return {
        success: true,
        message: `Prescription sent successfully to ${phoneNumber}`,
        messageSid: result.messageSid,
      };
    } catch (error) {
      console.error('Error sending prescription SMS:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to send prescription SMS',
      };
    }
  },
});
