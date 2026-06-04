# MatchFlow AI - Elite Matchmaker CRM Dashboard

MatchFlow AI is a polished, full-stack, AI-enhanced relationship consultant dashboard built with Next.js 15, Supabase Auth, Tailwind CSS, and OpenAI. It acts as a premium internal CRM platform for elite relationship managers to calculate matrimonial compatibility, generate AI relationship insights, draft introductory letters, and manage client files.

---

## 🌟 Key Features

1. **Premium Emotionally Aligned UI/UX**: Custom tailwind tokens with warm rose, peach, and slate colors. Features smooth Framer Motion transitions, custom scrollbars, and dynamic glassmorphism panels.
2. **Robust Matrimonial Engine**: Dynamic algorithmic pairing matching religion, age curves, height offsets, location, income alignment, children, pets, relocation readiness, shared values, and common hobbies.
3. **Smart but Simple AI Integrations**:
   - **AI Profile Summaries**: Generates concise, emotionally intelligent character capsules.
   - **AI Compatibility Analysis**: Evaluates pairings and writes a 2-3 sentence consultant-level overview of shared traits.
   - **AI Personalized Introductions**: Drafts a custom recommendation email to clients showcasing matching green flags.
4. **Gatekept Matchmaker Authentication**:
   - Integrated with **Supabase Auth**.
   - Server & client-side allowlist restriction checking (`allowedUsers.ts`).
   - One-click **Recruiter Demo Access** that auto-seeds and launches a live demo experience immediately.
5. **Interactive Consultation Notes**: Custom editable notepad for each client profile that autosaves logs locally on the browser.
6. **AI Loading Skeletons**: Integrated skeleton states and shimmers to provide a seamless wait-free aesthetic.

---

## 🛠️ Tech Stack

- **Core**: Next.js 15 (App Router with async cookies support)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (native variables config)
- **Icons**: Lucide Icons
- **Animation**: Framer Motion
- **Database / Auth**: Supabase Auth & SSR Cookie Middleware
- **AI Core**: OpenAI API Client (`gpt-4o-mini`)
- **Profiles Dataset**: 100 seeded Indian matrimonial profiles (under `data/profiles.json`)

---

## 📂 Project Structure

```text
├── app/
│   ├── actions/
│   │   └── auth.ts                # Server actions for login, signup, and logout
│   ├── api/
│   │   ├── ai/
│   │   │   ├── generate-intro/     # POST endpoint for match Proposal emails
│   │   │   ├── match-analysis/     # POST endpoint for compatibility summaries
│   │   │   └── profile-summary/    # POST endpoint for client descriptions
│   ├── dashboard/
│   │   ├── page.tsx               # Main Client dashboard with search & filter grids
│   │   └── profile/
│   │       └── [id]/              # Tabbed customer details & Suggested Matches panel
│   ├── login/
│   │   └── page.tsx               # Login page with demo credentials
│   ├── signup/
│   │   └── page.tsx               # Allowlisted-only registration screen
│   ├── globals.css                # Global theme configurations & CSS variables
│   ├── layout.tsx                 # Root font & structure layout
│   └── page.tsx                   # Default route handler (checks session and redirects)
├── components/
│   ├── CustomerCard.tsx           # Profile cards for dashboard view
│   ├── MatchesPanel.tsx           # Suggested matches list & AI explanation trigger
│   ├── NotesEditor.tsx            # Matchmaker consultation notepad
│   ├── SendMatchModal.tsx         # AI proposal mail review and send mockup
│   └── Sidebar.tsx                # Left navigation sidebar
├── data/
│   └── profiles.json              # 100 Indian matrimonial profiles
├── lib/
│   ├── allowedUsers.ts            # Authorized matchmaker allowlist
│   ├── matchingEngine.ts          # Algorithmic matchmaking calculations
│   ├── openai.ts                  # OpenAI config client
│   ├── supabaseClient.ts          # Browser-side auth client
│   └── supabaseServer.ts          # Server-side middleware & route helper client
├── types/
│   └── index.ts                   # TypeScript interfaces
├── middleware.ts                  # Global session checking & protected routing
├── package.json
└── tsconfig.json
```

---

## 🔑 Setup & Configuration

### 1. Environment Variables

Create a file named `.env.local` in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key

# OpenAI Configuration
OPENAI_API_KEY=sk-proj-...
```

*Note: For testing, the Supabase project requires email verification to be disabled in the Supabase Dashboard (`Authentication` -> `Providers` -> `Email` -> `Confirm Email` set to off) to support instant demo signups.*

### 2. Allowlisted Emails

Authorized emails are specified inside [allowedUsers.ts](file:///Users/adityasrivastava/Desktop/matchflow-ai/lib/allowedUsers.ts):

```typescript
export const allowedUsers = [
  "demo@tdc.com",
  "admin@tdc.com",
  "test@tdc.com"
];
```

Only these emails will be allowed to signup. If any other address is entered on `/signup`, they will be blocked with the message: *&ldquo;Access restricted to authorized matchmakers.&rdquo;*

---

## 🚀 Running Locally

Follow these steps to boot the application on your computer:

```bash
# 1. Install dependencies
npm install

# 2. Run the Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

- Click **&ldquo;Continue with Demo Account&rdquo;** on the login page to login instantly with:
  - **Email**: `demo@tdc.com`
  - **Password**: `Demo@123`

---

## 🚢 Deployment on Vercel

The app is completely production-ready and optimized for zero-config Vercel deployments:

1. **Deploy Repository**: Push your code to a GitHub, GitLab, or Bitbucket repository.
2. **Import Project**: Link your repository in the Vercel dashboard.
3. **Configure Environment Variables**: Enter the three values (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `OPENAI_API_KEY`) under Environment Variables.
4. **Deploy**: Click Deploy. Vercel automatically builds and optimizes the App Router routes.

---

## 🔒 Security Practices Enforced

- **API Gatekeeping**: AI endpoints `/api/ai/*` check session authorization token headers before executing completions to prevent token drains.
- **Server Action Protection**: Strict server-side verification of emails against the allowlist during signup before calling the Supabase Auth register endpoint.
- **Credential Storage**: Safe environment variables usage ensuring no keys or private certificates are hardcoded.
- **Cookie Security**: Auth cookies are marked HttpOnly, Secure, SameSite=Lax, and managed by Supabase SSR middleware to mitigate XSS exposure.
