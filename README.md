# MedSage CDSS - Clinical Decision Support System

A specialized AI-powered Clinical Decision Support System built with Next.js, designed to assist healthcare professionals with patient management, prescription creation, and patient communication. This application features intelligent patient record management, evidence-based medication suggestions, and secure SMS communication.

## Overview

MedSage CDSS is a healthcare-focused AI assistant that can:

- **Manage patient records** - Search existing patients, track allergies and medical history
- **Create prescriptions** - Generate evidence-based medication recommendations with automatic allergy checking
- **Communicate with patients** - Send prescription summaries via SMS (160 characters)
- **Process medical documents** - Upload and analyze patient EHRs for tailored prescriptions
- **Provide clinical guidance** - Offer medication recommendations based on symptoms

The application is designed for healthcare professionals and maintains strict patient data confidentiality throughout all interactions.

## Key Features

### 🔍 Patient Management
- Search existing patient records by name
- Track patient allergies and comprehensive medical history
- Quick access to previous medications and prescriptions
- Upload patient EHRs (PDF format) for context-aware prescriptions

### 💊 Prescription Creation
- Evidence-based medication suggestions
- Automatic allergy conflict checking
- Professional markdown-formatted prescriptions
- Instant database storage for future reference
- Prescription ID generation for easy tracking

### 📱 Patient Communication
- Send prescription summaries via SMS (160 character limit)
- Include prescription ID in messages for easy reference
- Twilio integration for secure messaging
- **Note**: SMS can only be sent to whitelisted Twilio numbers

### 🎥 Tutorial & Support
- Quick reference video tutorial available in the interface
- Step-by-step guidance for new users
- Comprehensive documentation

## Quick Start

### Watch the Tutorial
A comprehensive tutorial video is available directly in the application interface. Click "Watch tutorial" in the header to get started.

### Quick Actions
1. **Check patient records**: Type a patient's name
2. **Get medication recommendations**: Describe symptoms
3. **Start new prescription**: Say "new patient"
4. **Upload medical records**: Click the PDF upload button

## Project Structure

```text
medsage-cdss/
├── app/                          # Next.js application files
│   ├── api/chat/                 # Chat API endpoint
│   │   ├── route.ts              # Main chat handler with medical tools
│   │   └── tools/                 # AI tools (patient search, prescription creation)
│   ├── page.tsx                  # Main chat interface (UI)
│   ├── parts/                    # UI components (chat header)
│   └── terms/                    # Terms of Use page
├── components/                    # React components
│   ├── messages/                 # Message display components
│   ├── pdf-upload-button.tsx    # PDF upload functionality
│   └── ui/                       # Reusable UI components
├── lib/                          # Utility libraries
│   ├── moderation.ts             # Content moderation logic
│   ├── database.ts               # Patient record management
│   ├── sms.ts                    # Twilio SMS integration
│   └── utils.ts                  # General utilities
├── config.ts                     # ⭐ MAIN CONFIGURATION FILE
├── prompts.ts                    # ⭐ AI BEHAVIOR CONFIGURATION
└── package.json                  # Dependencies and scripts
```

## Configuration Files

### `config.ts` - Application Configuration

This is the **primary file** you'll edit to customize MedSage CDSS. Located in the root directory, it contains:

- **AI Identity**: `AI_NAME` (currently "MedSage CDSS") and `OWNER_NAME`
- **UI Text**: `CLEAR_CHAT_TEXT` - Label for the "New" button
- **Model Configuration**: `MODEL` - The AI model being used (OpenAI GPT-4 or GPT-5)
- **Medical Settings**: Configuration for prescription format, database connections

**Example customization:**

```typescript
export const AI_NAME = "Your Medical AI Assistant";
export const OWNER_NAME = "Your Medical Practice";
export const CLEAR_CHAT_TEXT = "New Patient";
```

### `prompts.ts` - AI Behavior and Instructions

This file controls **how the medical AI assistant behaves and responds**. Located in the root directory, it contains:

- **Clinical Identity**: Medical professional persona and expertise
- **Tool Usage**: When to search patient records, create prescriptions, send SMS
- **Medical Tone**: Professional, empathetic, evidence-based communication
- **Safety Guidelines**: HIPAA compliance, patient confidentiality rules
- **Prescription Format**: How to structure medication recommendations
- **Clinical Guardrails**: What the AI should refuse or escalate

**Example customization:**

```typescript
export const TONE_STYLE_PROMPT = `
- Maintain a professional, compassionate medical tone
- Use clear language appropriate for healthcare settings
- Always prioritize patient safety and evidence-based practice
- Respect patient confidentiality and HIPAA regulations
`;
```

## Environment Setup

Configure environment variables in your deployment platform (Vercel recommended). Add the following:

### Required Variables
- `OPENAI_API_KEY` - Required for AI model functionality
- `DATABASE_URL` - Connection string for patient records database

### Optional Variables
- `TWILIO_ACCOUNT_SID` - For SMS functionality
- `TWILIO_AUTH_TOKEN` - For SMS functionality
- `TWILIO_PHONE_NUMBER` - Your Twilio phone number

**Where to get API keys:**

- **OpenAI**: https://platform.openai.com/api-keys
- **Twilio**: https://www.twilio.com/console
- **Database**: Your database provider (PostgreSQL, MySQL, etc.)

**Important Notes**:
- SMS functionality requires whitelisted Twilio numbers for recipients
- OpenAI API may occasionally timeout - users should wait or re-enter prompts
- Patient data must remain strictly confidential per HIPAA guidelines

## Key Features in Detail

### Patient Record Management

The system maintains a comprehensive database of patient information:
- Patient demographics and contact information
- Allergy records with severity levels
- Medical history and previous diagnoses
- Prescription history with medication details
- EHR document storage and retrieval

### Prescription Creation Workflow

1. Search or create patient record
2. Review patient allergies and medical history
3. Describe symptoms or condition
4. AI suggests evidence-based medications
5. System checks for allergy conflicts
6. Generate formatted prescription
7. Store in database with unique prescription ID
8. Optional: Send SMS summary to patient

### SMS Communication

- Messages limited to 160 characters
- Includes prescription ID for reference
- Only works with whitelisted Twilio numbers
- Maintains HIPAA compliance standards

## Medical Compliance & Safety

### Data Privacy
- All patient data remains strictly confidential
- Cannot be shared without explicit patient consent
- Complies with HIPAA regulations
- Secure database storage with encryption

### Clinical Guidelines
- Evidence-based medication recommendations
- Automatic allergy and drug interaction checking
- Professional prescription formatting
- Clear documentation for legal compliance

### User Responsibilities
- Healthcare professionals must verify all AI suggestions
- Final prescription decisions rest with licensed practitioners
- AI serves as decision support, not replacement for clinical judgment
- Regular review of patient data accuracy

## Troubleshooting

### AI Not Responding
- Verify `OPENAI_API_KEY` is set correctly
- Check API quota and credits
- Wait 30-60 seconds for OpenAI timeout recovery
- Re-enter the prompt if necessary

### SMS Not Sending
- Verify Twilio credentials are configured
- Ensure recipient number is whitelisted in Twilio
- Check Twilio console for error messages
- Verify Twilio account has sufficient credits

### PDF Upload Issues
- Ensure PDF is under size limit (typically 10MB)
- Verify PDF contains readable text (not scanned images)
- Check browser console for error messages

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure database is accessible from deployment server
- Check database logs for connection errors
- Verify database tables are properly migrated

## Deployment

### Vercel (Recommended)

1. Fork or clone this repository
2. Connect to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

After making changes to `config.ts` or `prompts.ts`, commit and push to trigger automatic redeployment.

### Other Platforms

The application can be deployed to any platform supporting Next.js:
- AWS Amplify
- Netlify
- Railway
- Self-hosted with Node.js

## Customization Guide

### Changing Branding
1. Update `AI_NAME` in `config.ts`
2. Replace logo files in `/public/logo.png` and `/public/logo.jpg`
3. Modify color schemes in Tailwind configuration
4. Update favicon and metadata

### Adjusting Clinical Behavior
1. Edit `prompts.ts` to modify clinical tone and guidelines
2. Update medication recommendation criteria
3. Adjust allergy checking sensitivity
4. Modify prescription format templates

### Adding Medical Tools
1. Create tool file in `app/api/chat/tools/`
2. Implement tool logic (e.g., drug interaction checking)
3. Register tool in `route.ts`
4. Update UI to display tool usage

## Important Limitations

⚠️ **Medical Disclaimer**: This system is a clinical decision support tool and should not replace professional medical judgment. All AI-generated recommendations must be reviewed and approved by licensed healthcare professionals.

⚠️ **SMS Restrictions**: Patient communication via SMS is limited to whitelisted Twilio numbers. Contact the system administrator to add authorized numbers.

⚠️ **API Timeouts**: The OpenAI API may occasionally timeout. Users should wait briefly or re-enter prompts if the model doesn't respond.

⚠️ **Data Confidentiality**: Patient data must remain strictly confidential and cannot be shared without the patient's explicit consent per HIPAA regulations.

## Support & Documentation

- **Tutorial Video**: Access via "Watch tutorial" link in the application header
- **Terms of Use**: Available at `/terms` endpoint
- **Technical Support**: Contact system administrator
- **HIPAA Compliance Questions**: Consult your organization's compliance officer

## License

Copyright © 2025 RSS (or your organization name)

All patient data and medical information handled by this system is subject to HIPAA regulations and organizational data privacy policies.

---

**For Healthcare Professionals**: This tool is designed to enhance clinical decision-making, not replace it. Always verify AI recommendations against current medical guidelines and patient-specific factors.
