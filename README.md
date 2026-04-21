# VisionFlow AI

WhatsApp AI automation for UK optical practices. NHS-ready, GDPR compliant, Vercel-deployable.

## Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (Syne + DM Sans)
- **Charts**: Recharts
- **Routing**: React Router v7
- **Notifications**: Sonner
- **Backend / Automation**: n8n (separate — see setup guide)
- **AI**: OpenAI GPT-4o-mini + Whisper + text-embedding-ada-002
- **Vector DB**: Pinecone (index: `n8n`, dim: 1536, cosine)
- **CRM**: Google Sheets

## Quick Start

```bash
npm install
cp .env.example .env.local
# Fill in your API keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── pages/
│   ├── LandingPage.tsx         # Marketing page
│   ├── Onboarding.tsx          # 4-step setup flow
│   ├── auth/                   # Login + Signup
│   ├── dashboard/              # Main dashboard
│   ├── conversations/          # WhatsApp conversation view
│   ├── appointments/           # Appointment management
│   ├── leads/                  # Lead CRM
│   ├── knowledge/              # Knowledge base (Pinecone)
│   ├── escalations/            # Human escalation queue
│   ├── analytics/              # Analytics dashboard
│   ├── team/                   # Team management
│   ├── billing/                # Plan & billing (GBP)
│   ├── settings/               # Practice, AI, WhatsApp config
│   └── admin/                  # Super admin panel
├── components/
│   └── layout/AppLayout.tsx    # Sidebar + topbar
├── context/AppContext.tsx       # Global state
├── lib/utils.ts                 # Helpers (en-GB dates)
├── types.ts                     # TypeScript types
└── constants.ts                 # UK dental mock data + nav
```

## UK Dental Specifics

- NHS Band 1/2/3 pricing pre-loaded (England 2025/26)
- GDC + CQC fields on Practice type
- DNA (Did Not Attend) appointment status
- NHS vs Private lead categorisation
- GBP (£) billing plans: £79 / £149 / £299
- `en-GB` date formatting throughout
- Escalation triggers include dental emergency keywords

## Deploying to Vercel

```bash
npm run build
# or via Vercel CLI:
vercel --prod
```

Set environment variables in Vercel dashboard from `.env.example`.

## n8n Backend

See `Clinic_WhatsApp_AI_Setup_Guide.pdf` for the complete n8n workflow setup.
The frontend dashboard reads from the same Google Sheets that n8n writes to.
