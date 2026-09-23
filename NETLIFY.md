# Deploying ASTRA-TWIN to Netlify

ASTRA-TWIN is configured for deployment to **Netlify** with a **Vite React Frontend** and **Netlify Serverless Functions** for the backend Express API & AI diagnostics.

---

## Architecture on Netlify

```
Client Browser (Vite React 19 SPA)
   │
   ├─── Static Assets & HTML ────────► Netlify High-Performance CDN (publish: "dist")
   │
   └─── API Requests (/api/*) ───────► Netlify Serverless Functions (netlify/functions/api.ts)
                                           │
                                           ├──► Gemini 1.5/2.5 Pro & Flash AI
                                           │
                                           ├──► Supabase Cloud Database (lugmtagstkfbnblpfjsl)
                                           │
                                           └──► Deterministic Aerospace Anomaly & Risk Engine
```

---

## 1. Quick Deploy via Netlify Dashboard

1. Push your changes to your GitHub repository:
   ```bash
   git add .
   git commit -m "Configure Netlify deployment with serverless functions"
   git push origin main
   ```
2. Go to [Netlify Dashboard](https://app.netlify.com/) and click **"Add new site"** → **"Import an existing project"**.
3. Select **GitHub** and authorize your repository `ahir-arpit/astra-twin`.
4. Netlify will automatically detect the settings from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`
5. Click **"Deploy site"**.

---

## 2. Environment Variables Configuration

In your Netlify Site Settings (**Site configuration** → **Environment variables**), add the following environment variables:

| Variable Name | Description | Example / Default Value |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini API Key for Explainable AI | `AIzaSy...` |
| `SUPABASE_URL` | Supabase Project URL | `https://lugmtagstkfbnblpfjsl.supabase.co` |
| `SUPABASE_KEY` | Supabase Anon/Service Key | `sb_publishable__9mmHDwu1keswWVCULYXuw_VX9z4xOi` |
| `VITE_SUPABASE_URL` | Supabase Frontend URL | `https://lugmtagstkfbnblpfjsl.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase Frontend Key | `sb_publishable__9mmHDwu1keswWVCULYXuw_VX9z4xOi` |
| `NODE_VERSION` | Node.js Runtime Version | `20` |

---

## 3. Alternative: Deploy via Netlify CLI

If you prefer using the terminal:

```bash
# 1. Install Netlify CLI globally
npm install -g netlify-cli

# 2. Authenticate
netlify login

# 3. Initialize & Link site
netlify init

# 4. Deploy to production
netlify deploy --build --prod
```

---

## 4. Verification Checklist on Netlify

Once deployed, verify:
- **Landing Page & Dashboard:** Navigate to `https://<your-site>.netlify.app/`
- **Direct Page Refresh:** Refresh any sub-view (handled by `/* -> /index.html` rewrite)
- **API Health Check:** Visit `https://<your-site>.netlify.app/api/health`
- **Telemetry Stream:** Verify telemetry persists or falls back seamlessly
- **Gemini Mission Assistant:** Test the AI copilot in the header with a mission prompt
