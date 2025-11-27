import { openai } from "@ai-sdk/openai";
import { fireworks } from "@ai-sdk/fireworks";
import { wrapLanguageModel, extractReasoningMiddleware } from "ai";

export const MODEL = openai('gpt-4.1');

// If you want to use a Fireworks model, uncomment the following code and set the FIREWORKS_API_KEY in Vercel
// NOTE: Use middleware when the reasoning tag is different than think. (Use ChatGPT to help you understand the middleware)
// export const MODEL = wrapLanguageModel({
//     model: fireworks('fireworks/deepseek-r1-0528'),
//     middleware: extractReasoningMiddleware({ tagName: 'think' }), // Use this only when using Deepseek
// });


function getDateAndTime(): string {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const timeStr = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
    });
    return `The day today is ${dateStr} and the time right now is ${timeStr}.`;
}

export const DATE_AND_TIME = getDateAndTime();

export const AI_NAME = "MedSage CDSS";
export const OWNER_NAME = "RSS";
export const DOCUMENT_PATH = "public/Prescription.html"; 

export const WELCOME_MESSAGE = `Hello! 👋 Welcome to ${AI_NAME}!

I'm your intelligent CDSS assistant. Here's what I can help you with:

| 🔍 Patient Management | 💊 Prescription Creation | 📱 Patient Communication |
|----------------------|--------------------------|---------------------------|
| - Search existing patient records<br><br>- Track patient allergies and medical history<br><br>- Quick access to previous medications<br><br>- Upload patient EHRs for tailored prescriptions | - Evidence-based medication suggestions<br><br>- Automatic allergy conflict checking<br><br>- Professional markdown-formatted prescriptions<br><br>- Instant database storage for future reference | - Send prescription summaries via SMS (160 characters)<br><br>- Include prescription ID for easy reference |

---

**🔄 Quick Actions:**

- Type patient name to check their records
- Describe symptoms to get medication recommendations  
- Say "new patient" to start a fresh prescription

---

How can I assist you today?`;

export const CLEAR_CHAT_TEXT = "New";

export const MODERATION_DENIAL_MESSAGE_SEXUAL = "I can't discuss explicit sexual content. Please ask something else.";
export const MODERATION_DENIAL_MESSAGE_SEXUAL_MINORS = "I can't discuss content involving minors in a sexual context. Please ask something else.";
export const MODERATION_DENIAL_MESSAGE_HARASSMENT = "I can't engage with harassing content. Please be respectful.";
export const MODERATION_DENIAL_MESSAGE_HARASSMENT_THREATENING = "I can't engage with threatening or harassing content. Please be respectful.";
export const MODERATION_DENIAL_MESSAGE_HATE = "I can't engage with hateful content. Please be respectful.";
export const MODERATION_DENIAL_MESSAGE_HATE_THREATENING = "I can't engage with threatening hate speech. Please be respectful.";
export const MODERATION_DENIAL_MESSAGE_ILLICIT = "I can't discuss illegal activities. Please ask something else.";
export const MODERATION_DENIAL_MESSAGE_ILLICIT_VIOLENT = "I can't discuss violent illegal activities. Please ask something else.";
export const MODERATION_DENIAL_MESSAGE_SELF_HARM = "I can't discuss self-harm. If you're struggling, please reach out to a mental health professional or crisis helpline.";
export const MODERATION_DENIAL_MESSAGE_SELF_HARM_INTENT = "I can't discuss self-harm intentions. If you're struggling, please reach out to a mental health professional or crisis helpline.";
export const MODERATION_DENIAL_MESSAGE_SELF_HARM_INSTRUCTIONS = "I can't provide instructions related to self-harm. If you're struggling, please reach out to a mental health professional or crisis helpline.";
export const MODERATION_DENIAL_MESSAGE_VIOLENCE = "I can't discuss violent content. Please ask something else.";
export const MODERATION_DENIAL_MESSAGE_VIOLENCE_GRAPHIC = "I can't discuss graphic violent content. Please ask something else.";
export const MODERATION_DENIAL_MESSAGE_DEFAULT = "Your message violates our guidelines. I can't answer that.";

export const PINECONE_TOP_K = 40;
export const PINECONE_INDEX_NAME = "cdss-bot";
export const PINECONE_API_KEY="cpcsk_2hZrsM_DYFPYCSMSPsuv6bRRA3VjGktzgHADfpvNnQRecZvn8oj1c6joHfmxJpscjTK8nQ";
export const PINECONE_HOST="https://cdss-bot-zkp6imn.svc.aped-4627-b74a.pinecone.io";
export const TWILIO_ACCOUNT_SID="ACf3ef3a25aa6d1dec0ff8a4a61aa30aef";
export const TWILIO_AUTH_TOKEN="9d8d28376bf01160b08029d56fae5e2c";
export const TWILIO_PHONE_NUMBER="+14013563393";
