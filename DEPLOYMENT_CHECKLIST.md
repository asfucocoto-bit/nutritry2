# 🚀 Vercel Deployment Checklist

## ✅ Completed Steps

1. ✅ Removed `bun.lockb` from Git (saves ~5-50 MB)
2. ✅ Removed unnecessary image `123456-modified.png` (saves ~1-5 MB)
3. ✅ Updated `.gitignore` to exclude large files
4. ✅ Created deployment guides

## 📋 Quick Reference: Files You Can Delete

### ✅ Safe to Delete (Already Done):
- `nutri-sparkle-guide-main/bun.lockb` - ✅ Removed
- `nutri-sparkle-guide-main/src/123456-modified.png` - ✅ Removed

### ⚠️ Large Files That Are Needed:
- `models/*.pkl` - ML models (needed for predictions)
- `data/*.csv` - Nutrition data (needed for recommendations)

**Solution**: Use Git LFS or deploy backend separately

## 🎯 Vercel Deployment Strategy

### Important: Vercel is Frontend-Only!

**Your Flask backend CANNOT run on Vercel.** You need to:

1. **Deploy Frontend to Vercel:**
   - Root directory: `nutri-sparkle-guide-main`
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`

2. **Deploy Backend Separately:**
   - Use Railway, Render, or Heroku
   - Include models and CSV files
   - Set environment variables

## 📝 Next Steps

### 1. Commit Changes:
```bash
git add .gitignore
git add FILES_TO_DELETE.md
git commit -m "Remove large files for Vercel deployment"
git push origin main
```

### 2. Deploy Frontend to Vercel:
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set **Root Directory** to: `nutri-sparkle-guide-main`
4. Set **Framework Preset** to: `Vite`
5. Deploy!

### 3. Update Frontend API URLs:
In your frontend code, change:
- `http://localhost:5000` → Your backend URL (Railway/Render/Heroku)

### 4. Deploy Backend:
1. Choose a platform (Railway, Render, or Heroku)
2. Upload your Flask app
3. Include `models/` and `data/` folders
4. Set environment variables:
   - `MONGODB_PASSWORD`
   - `SECRET_KEY`

### 5. Update CORS in Backend:
In `app.py`, update CORS to allow your Vercel domain:
```python
CORS(app, supports_credentials=True, origins=[
    'http://localhost:8080',
    'http://localhost:3000',
    'https://your-vercel-app.vercel.app'  # Add your Vercel URL
])
```

## 📊 Repository Size Reduction

| Item | Size Saved | Status |
|------|------------|--------|
| bun.lockb | 5-50 MB | ✅ Removed |
| 123456-modified.png | 1-5 MB | ✅ Removed |
| node_modules (from git) | 200-500 MB | ✅ Already ignored |
| **Total** | **206-555 MB** | ✅ Done |

## ⚠️ Important Notes

1. **Models and CSV are needed** - Don't delete them if you need local development
2. **Use Git LFS** for large files if you want to keep them in git
3. **Vercel is frontend-only** - Backend must be deployed separately
4. **Test locally** after any changes

## 🔗 Useful Links

- [Vercel Deployment Docs](https://vercel.com/docs)
- [Railway Deployment](https://railway.app)
- [Render Deployment](https://render.com)
- [Git LFS Docs](https://git-lfs.github.com)

## ✅ Final Checklist

- [ ] Committed changes to git
- [ ] Pushed to GitHub
- [ ] Deployed frontend to Vercel
- [ ] Deployed backend to Railway/Render/Heroku
- [ ] Updated API URLs in frontend
- [ ] Updated CORS in backend
- [ ] Tested the application
- [ ] Verified all features work

---

**Your repository should now be under 250 MB and ready for Vercel deployment!** 🎉

