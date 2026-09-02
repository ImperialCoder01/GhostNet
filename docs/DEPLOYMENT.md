# Deployment & Infrastructure Guide

This guide covers local development, Supabase setup, and production deployment on Vercel.

---

## 1. Local Development Setup

### Prerequisites
* **Node.js:** v18.0.0 or higher (v20+ recommended)
* **npm:** v9.0.0 or higher

### Steps
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/ImperialCoder01/GhostNet.git
   cd GhostNet/GhostNet-app/GhostNet-app
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase project credentials and AI keys:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   GROQ_API_KEY=gsk_...
   GEMINI_API_KEY=AIzaSy...
   ```

4. **Start the Local Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 2. Supabase Setup (Database & Storage)

1. Create a new Supabase project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Run the schema migrations from `supabase/schema.sql` (or execute `npm run supabase:setup`).
4. Ensure the `evidence` bucket is created under **Storage** with Public read access.

---

## 3. Production Deployment on Vercel

GhostNet AI is optimized for 1-click deployment on **Vercel**:

### Deploy Steps
1. Import the repository into your Vercel dashboard.
2. Set the **Root Directory** to `GhostNet-app/GhostNet-app` (if using the nested directory).
3. Under **Environment Variables**, add:
   * `VITE_SUPABASE_URL` (Frontend safe)
   * `VITE_SUPABASE_ANON_KEY` (Frontend safe)
   * `GROQ_API_KEY` (Serverless Edge secret)
   * `GEMINI_API_KEY` (Serverless Edge secret)
   * `OPENAI_API_KEY` (Optional serverless fallback)
4. Click **Deploy**. Vercel will automatically build the React bundle and deploy `/api/analyze.js` as an Edge Serverless function.
