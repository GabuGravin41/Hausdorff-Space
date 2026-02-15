# Hausdorff Space

A React application for rigorous logical analysis using the Deepseek model via OpenRouter.

## Quick Start

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local with your OpenRouter API key
echo "VITE_OPENROUTER_API_KEY=sk-or-v1-your-key-here" > .env.local

# 3. Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Get Your OpenRouter API Key

1. Sign up at [openrouter.io](https://openrouter.io)
2. Go to your dashboard and copy your API key
3. Add it to `.env.local`:
   ```
   VITE_OPENROUTER_API_KEY=sk-or-v1-your-actual-key
   ```

---

## Deploy to Vercel (Free)

### 1. Push Code to GitHub

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel

- Go to [vercel.com/new](https://vercel.com/new)
- Click "Import Git Repository"
- Select your GitHub repo
- Click "Import"

### 3. Add Environment Variable

In the Vercel dashboard:
1. Go to **Settings > Environment Variables**
2. Add a new variable:
   - Name: `VITE_OPENROUTER_API_KEY`
   - Value: `sk-or-v1-your-actual-api-key`
3. Click "Save"

### 4. Deploy

Click the **Deploy** button. Your app will be live in ~1-2 minutes at a URL like:
```
https://your-app.vercel.app
```

---

## How It Works

```
React Frontend (Vercel CDN)
    ↓↓
  /api/openrouter (Vercel Serverless Function)
    ↓↓
  OpenRouter API (Deepseek Model)
```

- **Frontend:** React app using Vite, hosted as static files on Vercel CDN
- **Backend:** Single serverless function (`api/openrouter.ts`) that:
  - Receives API requests from your frontend
  - Adds your OpenRouter API key securely
  - Forwards to the Deepseek model
  - Returns the response

**Your API key stays private—it only lives on the Vercel backend, never exposed to the browser.**

---

## Tech Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS, D3.js
- **Backend:** Vercel Serverless Functions (Node.js)
- **AI Model:** Deepseek (via OpenRouter)

---

## Troubleshooting

### 404 Error on `/api/openrouter`
- Check that `VITE_OPENROUTER_API_KEY` is set in Vercel dashboard
- Verify the API key is valid on openrouter.io
- Wait 30 seconds after setting the env var (Vercel needs time to redeploy)

### API key not loading locally
- Make sure `.env.local` exists in the project root
- Restart `npm run dev` after creating/updating `.env.local`

### Build fails on Vercel
- Check that all dependencies are installed: `npm install`
- Verify `api/openrouter.ts` is in the correct directory
- Check Vercel build logs for specific errors

---

## Development

```bash
npm run dev       # Start local dev server
npm run build     # Build for production
npm run preview   # Preview production build locally
```

---

## License

MIT
