# Hausdorff Space - Deployment Guide

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env.local` with your OpenRouter API key:**
   ```bash
   VITE_OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
   ```

3. **Start dev server (http://localhost:5173):**
   ```bash
   npm run dev
   ```

The local Vite dev middleware automatically proxies `/api/openrouter` requests to the OpenRouter API with your API key.

---

## Vercel Deployment

### Prerequisites
- GitHub account with your code pushed to a repository
- Vercel account (free at [vercel.com](https://vercel.com))

### Steps

1. **Import project to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select "Import Git Repository"
   - Choose your GitHub repo with this project

2. **Set environment variables:**
   - In Vercel dashboard, go to **Settings > Environment Variables**
   - Add: `VITE_OPENROUTER_API_KEY` = `sk-or-v1-your-actual-api-key`
   - Click "Save"

3. **Deploy:**
   - Click "Deploy"
   - Your app will automatically build and deploy
   - Frontend lives at your Vercel domain (e.g., `https://yourdomain.vercel.app`)
   - API function at `https://yourdomain.vercel.app/api/openrouter`

### How it Works

- **Frontend (React):** Built as static files, served by Vercel's CDN
- **Backend (API):** Serverless function at `api/openrouter.ts` runs on Vercel's infrastructure
  - Receives POST requests from the frontend
  - Securely forwards to OpenRouter with your API key (kept server-side only)
  - Returns results to frontend

**Your API key is never exposed to the browser—it stays secure on the Vercel backend.**

---

## File Structure

```
Hausdorff-Space/
├── src/                    # React app files
├── api/
│   └── openrouter.ts       # Vercel serverless function (backend proxy)
├── .env.local              # Local dev secrets (not committed)
├── vercel.json             # Deployment configuration
├── vite.config.ts          # Dev server config with local proxy middleware
└── package.json            # Dependencies and build scripts
```

---

## Troubleshooting

**502 Bad Gateway on `/api/openrouter`**
- Check that `VITE_OPENROUTER_API_KEY` is set in Vercel dashboard
- Verify API key is valid on [openrouter.io](https://openrouter.io)

**API key not loading locally**
- Ensure `.env.local` exists in project root
- Restart `npm run dev` after creating/updating `.env.local`

**Frontend can't reach API**
- Verify CORS is enabled in `api/openrouter.ts`
- Check network tab in browser DevTools for actual endpoint being called
