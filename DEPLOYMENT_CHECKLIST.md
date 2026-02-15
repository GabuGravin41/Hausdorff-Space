# Pre-Deployment Checklist ✅

Use this checklist before deploying to ensure everything is ready for production.

## 🔧 Configuration

- [x] `.env.example` file exists with all required variables
- [x] `.env.local` is listed in `.gitignore`
- [x] `vercel.json` is properly configured
- [x] `package.json` has `engines` field specifying Node.js version
- [x] `.nvmrc` file specifies Node.js 18

## 🧪 Testing

- [x] `npm install` runs without errors
- [x] `npm run build` completes successfully
- [x] `npx tsc --noEmit` passes with no TypeScript errors
- [ ] Local dev server runs: `npm run dev`
- [ ] All pages load correctly locally
- [ ] AI Colloquium feature works (requires API key)
- [ ] Topology visualization renders properly
- [ ] Mobile responsiveness tested

## 🔒 Security

- [x] API keys are stored in environment variables only
- [x] No secrets committed to Git
- [x] API endpoints use proper error handling
- [x] CORS is properly configured in serverless function
- [x] Input validation implemented

## 📝 Documentation

- [x] README.md is comprehensive and up-to-date
- [x] Environment variables are documented
- [x] Deployment instructions are clear
- [x] Troubleshooting guide included
- [x] Architecture diagram provided

## 🚀 Vercel Setup

Before deploying:

1. **Repository**: Code is pushed to GitHub/GitLab/Bitbucket
2. **Vercel Account**: Account created at vercel.com
3. **Environment Variables Ready**: 
   - `VITE_OPENROUTER_API_KEY` obtained from OpenRouter

## 📋 Deployment Steps

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Configure build settings:
   - Framework: Vite
   - Root Directory: `Hausdorff-Space` (if applicable)
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variable: `VITE_OPENROUTER_API_KEY`
5. Click Deploy
6. Wait 1-2 minutes for deployment
7. Test the live site

## ✅ Post-Deployment Verification

After deploying, verify:

- [ ] Site loads at the Vercel URL
- [ ] All sections render correctly
- [ ] Navigation works properly
- [ ] Topology visualization is interactive
- [ ] AI Colloquium accepts input
- [ ] API calls work (check browser console for errors)
- [ ] Mobile view is responsive
- [ ] LaTeX math renders properly
- [ ] No console errors
- [ ] Performance is acceptable (check Lighthouse scores)

## 🐛 If Something Goes Wrong

### Check Vercel Logs
1. Go to Vercel Dashboard
2. Select your project
3. Click "Functions" tab
4. Check `/api/openrouter` logs

### Common Issues

**Build Failed**
```bash
# Test build locally first
npm run build
```

**API Not Working**
- Verify `VITE_OPENROUTER_API_KEY` is set in Vercel
- Check it's spelled correctly (case-sensitive)
- Ensure it starts with `sk-or-v1-`
- Redeploy after adding env vars

**404 on API Routes**
- Verify `api/openrouter.ts` exists in repo
- Check `vercel.json` configuration
- Ensure serverless function is within size limits

## 📊 Performance Optimization

Post-deployment optimizations to consider:

- [ ] Enable Vercel Analytics
- [ ] Monitor API usage and costs
- [ ] Set up custom domain (optional)
- [ ] Configure caching headers
- [ ] Optimize bundle size if needed

## 🔄 Continuous Deployment

Once set up, Vercel automatically:
- Deploys on every push to `main` branch
- Creates preview deployments for pull requests
- Runs build checks before deploying

---

**Status**: ✅ Ready for Deployment

Last updated: 2026-02-15
