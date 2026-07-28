# MatchFlow AI

MatchFlow AI is a premium, high-end matchmaking CRM designed specifically for elite matrimonial relationship consultants. Built with a luxurious rose-peach themed interface and high-fidelity interactions, it allows consultants to curate client dossiers, evaluate algorithmic compatibility, generate AI-powered proposals, and analyze demographic distributions.



## ✨ Features

*   **Interactive Match Matcher**: Smooth Tinder-style swiping interface powered by Framer Motion for rapid candidate screening.
*   **Indian Matrimonial Compatibility Engine**: A complex scoring model (`lib/matchingEngine.ts`) that weights gender-specific age/height preferences, income tiers, cultural alignment (religion and caste), lifestyle goals (children, pets), and relocation preferences.
*   **Dual-LLM AI Suite**:
    *   **Anthropic API (`claude-sonnet`)**: Generates instant, 2-3 line contextual matchmaking rationales directly on the client's screen.
    *   **OpenAI API (`gpt-4o-mini`)**: Automates high-fidelity personalized email proposal drafting complete with candidate details, compatibility scores, and shared traits.
    *   *Self-Healing Heuristic Fallback*: Dynamically falls back to smart local natural language processing if API keys are missing.
*   **Analytics Dashboard**: Visualizes demographic distributions (religion, geography, etc.) and match performance trends over time using responsive Recharts.
*   **Client Dossier Management**: Comprehensive profile viewing, private notes editor, active matchmaking progress tracking, and contact status updates.

---

## 🛠️ Tech Stack & Architecture

*   **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
*   **Styling & Motion**: Tailwind CSS v4 + Framer Motion (custom Rose-Peach color scheme)
*   **Database & Authentication**: Supabase (Auth & Database)
*   **Edge Router**: Custom proxy middleware (`proxy.ts`) designed to match Next.js 16 server context routing.
*   **Visualizations**: Recharts for live demographic breakdown and matchmaking velocity tracking.

---

## 🚀 Quick Start

### 1. Prerequisites
Ensure you have Node.js 18+ and npm installed.

### 2. Installation
Clone the repository and install the project dependencies:
```bash
# Clone the repository
git clone https://github.com/adisri19/matchflow-ai.git
cd matchflow-ai

# Install dependencies
npm install
```

### 3. Setup Environment Variables
Create a local environment file based on the example:
```bash
cp .env.example .env
```
Provide the required keys in `.env` if using external services:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

> [!NOTE]
> **Zero-Config/Mock Mode**: MatchFlow AI features a self-healing mock state. If Supabase or AI environment credentials are not provided, the CRM will seamlessly activate its mock data layer, allowing immediate database interactions and heuristic LLM simulation out of the box.

### 4. Running the Project
Start the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Access

You can log in instantly on the login page using the **"Continue with Demo Account"** button, or log in manually with the following credentials:
*   **Email**: `demo@tdc.com`
*   **Password**: `Demo@123`

---

## 📐 Match Scoring Algorithm

The matching engine processes matches based on the following key areas:
1.  **Gender-Specific Matrimonial Curves**:
    *   **Male Profiles**: Prefers younger, shorter candidates, matching/similar income ranges, and aligned children expectations.
    *   **Female Profiles**: Prefers older, taller candidates, equal or higher income brackets (financial stability index), and aligned family expectations.
2.  **Cultural Alignment Rules**: Matches religion preferences and checks caste filters (with automatic bypass for "Open" or "Not Applicable" settings).
3.  **Logistics & Lifestyle**: Computes geo-distance (same city vs. same state), pet compatibility, wants-children alignment, and relocation availability.
4.  **Strengths & Warnings Summary**: Analyzes profiles to call out green flags (e.g. perfect age/height alignment) and warnings (e.g. interfaith differences, relocation mismatch) to help the consultant make informed selections.
