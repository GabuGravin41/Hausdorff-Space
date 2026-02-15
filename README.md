# Hausdorff Space

**A Nairobi-based intellectual collective website** featuring AI-powered rigor analysis, interactive topology visualizations, and a manifesto for structured thought.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/hausdorff-space)

## 🚀 Live Demo

Visit the deployed site: [hausdorff-space.vercel.app](https://hausdorff-space.vercel.app)

## ✨ Features

- **Interactive Topology Visualization**: D3.js-powered visualization of Hausdorff separation axiom
- **AI-Powered Rigor Analysis** (Virtual Colloquium): Submit arguments for logical analysis using Deepseek AI
- **Responsive Design**: Mobile-friendly with scroll animations and smooth interactions
- **Mathematical Typography**: LaTeX rendering with KaTeX for mathematical notation
- **Modern Stack**: React 19, TypeScript, Vite, Tailwind CSS

---

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn
- OpenRouter API key (free tier available)

---

## 🛠️ Local Development

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/hausdorff-space.git
cd hausdorff-space/Hausdorff-Space

# Install dependencies
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the `Hausdorff-Space` directory:

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local` and add your OpenRouter API key:

```env
VITE_OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
```

### 3. Get Your OpenRouter API Key

1. Sign up at [openrouter.io](https://openrouter.io)
2. Navigate to your dashboard
3. Copy your API key
4. Paste it into `.env.local`

**Note**: OpenRouter offers free tier access to Deepseek models.

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🚢 Deploy to Vercel

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/hausdorff-space)

1. Click the button above
2. Connect your GitHub account
3. Add environment variable: `VITE_OPENROUTER_API_KEY`
4. Deploy!

### Option 2: Manual Deploy

#### Step 1: Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - Ready for deployment"

# Add remote and push
git remote add origin https://github.com/yourusername/hausdorff-space.git
git branch -M main
git push -u origin main
```

#### Step 2: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `Hausdorff-Space`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### Step 3: Add Environment Variables

In the Vercel dashboard during import or after deployment:

1. Go to **Settings → Environment Variables**
2. Add:
   - **Key**: `VITE_OPENROUTER_API_KEY`
   - **Value**: Your OpenRouter API key (starts with `sk-or-v1-`)
   - **Environment**: Production, Preview, Development (select all)
3. Click **Save**

#### Step 4: Deploy

Click **Deploy**. Your site will be live in 1-2 minutes at:
```
https://your-project-name.vercel.app
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│   React Frontend (Static Files)    │
│   Hosted on Vercel CDN             │
└──────────────┬──────────────────────┘
               │
               │ POST /api/openrouter
               ▼
┌─────────────────────────────────────┐
│   Vercel Serverless Function        │
│   (api/openrouter.ts)              │
│   - Adds API key securely          │
│   - Proxies requests                │
└──────────────┬──────────────────────┘
               │
               │ HTTPS
               ▼
┌─────────────────────────────────────┐
│   OpenRouter API                    │
│   (Deepseek Model)                 │
└─────────────────────────────────────┘
```

### Security

- **API Key Protection**: Your OpenRouter API key is stored as an environment variable and only accessible to the serverless function
- **Never Exposed**: The key is never sent to the browser or exposed in client-side code
- **HTTPS Only**: All API communications use encrypted HTTPS

---

## 📦 Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling (via CDN)
- **D3.js v7.9.0** - Interactive visualizations
- **KaTeX** - LaTeX math rendering

### Backend
- **Vercel Serverless Functions** - API proxy
- **Node.js 18+** - Runtime
- **Express** - Local development server

### AI
- **OpenRouter** - AI API gateway
- **Deepseek** - Language model for rigor analysis

---

## 📁 Project Structure

```
Hausdorff-Space/
├── api/
│   └── openrouter.ts          # Vercel serverless function
├── components/
│   ├── AIColloquium.tsx       # AI analysis interface
│   └── TopologyViz.tsx        # D3.js visualization
├── services/
│   └── geminiService.ts       # OpenRouter API client
├── App.tsx                     # Main application component
├── index.tsx                   # React entry point
├── index.html                  # HTML template
├── types.ts                    # TypeScript interfaces
├── vite.config.ts             # Vite configuration
├── vercel.json                # Vercel deployment config
├── tsconfig.json              # TypeScript config
├── package.json               # Dependencies
├── .env.example               # Environment variables template
└── .env.local                 # Your local env vars (ignored by git)
```

---

## 🐛 Troubleshooting

### Build Issues

**Problem**: Build fails with TypeScript errors
```bash
# Solution: Check TypeScript compilation
npx tsc --noEmit
```

**Problem**: Build fails with dependency errors
```bash
# Solution: Clean install
rm -rf node_modules package-lock.json
npm install
```

### Deployment Issues

**Problem**: 404 error on `/api/openrouter`
- ✅ Verify `VITE_OPENROUTER_API_KEY` is set in Vercel dashboard
- ✅ Check that the API key starts with `sk-or-v1-`
- ✅ Wait 30 seconds after setting env var (Vercel needs to redeploy)
- ✅ Check Vercel function logs for errors

**Problem**: "API key not configured" error
- ✅ Environment variable must be named exactly: `VITE_OPENROUTER_API_KEY`
- ✅ Redeploy after adding environment variables
- ✅ Verify API key is valid at [openrouter.io/keys](https://openrouter.io/keys)

**Problem**: Rate limit exceeded
- ✅ OpenRouter free tier has rate limits
- ✅ Wait a few minutes before retrying
- ✅ Consider upgrading to a paid tier for higher limits

### Local Development Issues

**Problem**: API key not loading locally
- ✅ Ensure `.env.local` exists in `Hausdorff-Space` directory
- ✅ Restart `npm run dev` after creating/updating `.env.local`
- ✅ Variable must start with `VITE_` prefix

**Problem**: Port already in use
```bash
# Solution: Change port in vite.config.ts or kill the process
npm run dev -- --port 3001
```

---

## 🧪 Scripts

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm run preview      # Preview production build locally
```

---

## 🔒 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_OPENROUTER_API_KEY` | Yes | OpenRouter API key for AI analysis |

**Note**: All environment variables for Vite must be prefixed with `VITE_` to be exposed to the client.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🙏 Acknowledgments

- **Hausdorff Space Collective** - The intellectual collective this website represents
- **OpenRouter** - AI API gateway providing free access to Deepseek
- **Vercel** - Free hosting and serverless functions
- **D3.js** - Powerful data visualization library

---

## 📧 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Contact the Hausdorff Space collective

---

**Built with rigor, deployed with confidence. 🎯**
