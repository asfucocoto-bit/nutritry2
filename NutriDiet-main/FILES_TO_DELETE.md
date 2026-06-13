# Files Safe to Delete - NutriDiet Project

## ✅ Already Removed from Git:
1. ✅ `nutri-sparkle-guide-main/bun.lockb` - Removed (saves ~5-50 MB)
2. ✅ `nutri-sparkle-guide-main/src/123456-modified.png` - Removed (saves ~1-5 MB)

## 📋 Summary of Files That Can Be Deleted

### 1. Files Safe to Delete (Not Needed):

#### Already Deleted:
- ✅ `nutri-sparkle-guide-main/bun.lockb` - Bun lock file (use npm/yarn instead)
- ✅ `nutri-sparkle-guide-main/src/123456-modified.png` - Unnecessary image

#### Can Be Deleted from Local (Already in .gitignore):
- `node_modules/` - Will be reinstalled via `npm install`
- `__pycache__/` - Python cache, regenerated automatically
- `*.db` files - Local databases, use MongoDB instead
- `dist/` - Build output, regenerated on build
- `.venv/` or `venv/` - Python virtual environment

### 2. Files Needed But Large (Handle with Git LFS or External Storage):

#### Essential for Backend:
- ⚠️ `models/*.pkl` - ML models (~10-100 MB total)
  - **Needed for**: Diet predictions
  - **Solution**: Use Git LFS or upload to cloud storage
  - **Alternative**: Regenerate with `python scripts/train_model.py`

- ⚠️ `data/processed_diet.csv` - Processed nutrition data (~5-50 MB)
  - **Needed for**: Meal recommendations
  - **Solution**: Use Git LFS or upload to database
  - **Alternative**: Regenerate with `python scripts/preprocess_data.py`

- ⚠️ `data/nutritions.csv` - Raw nutrition data (~5-50 MB)
  - **Needed for**: Data preprocessing
  - **Solution**: Use Git LFS
  - **Note**: Can be regenerated if you have the original source

### 3. Files Needed for Frontend (Keep):

- ✅ `nutri-sparkle-guide-main/public/favicon.png` - Small, keep
- ✅ All React source files - Needed
- ✅ `package.json` and `package-lock.json` - Needed
- ✅ Configuration files - Needed

## 🎯 For Vercel Deployment (Frontend Only):

### What You Need:
- ✅ `nutri-sparkle-guide-main/` folder
- ✅ Frontend source code
- ✅ `package.json`

### What You DON'T Need:
- ❌ Python backend (`app.py`, `requirements.txt`)
- ❌ ML models (`models/`)
- ❌ CSV data (`data/`)
- ❌ Python scripts (`scripts/`)
- ❌ Backend database files

### Solution:
**Deploy only the frontend folder to Vercel:**
1. Set Vercel root directory to: `nutri-sparkle-guide-main`
2. Update API endpoints in frontend to point to your backend URL
3. Deploy backend separately (Railway, Render, Heroku)

## 🔧 Commands to Clean Up:

### Remove Files from Git (Already Done):
```bash
git rm --cached nutri-sparkle-guide-main/bun.lockb
git rm --cached nutri-sparkle-guide-main/src/123456-modified.png
```

### Remove Large Files from Git History (Optional - Use Git LFS Instead):
```bash
# Install Git LFS
git lfs install

# Track large files
git lfs track "*.pkl"
git lfs track "data/*.csv"

# Migrate existing files
git lfs migrate import --include="*.pkl,data/*.csv" --everything
```

### Clean Local Files (Safe - They'll be regenerated):
```bash
# Remove node_modules (will be reinstalled)
rm -rf nutri-sparkle-guide-main/node_modules

# Remove Python cache
rm -rf __pycache__
rm -rf scripts/__pycache__

# Remove build outputs
rm -rf nutri-sparkle-guide-main/dist
```

## 📊 Size Reduction Estimate:

| Action | Size Saved | Risk |
|--------|------------|------|
| Remove bun.lockb | 5-50 MB | ✅ Safe |
| Remove unnecessary images | 1-5 MB | ✅ Safe |
| Use Git LFS for .pkl | 10-100 MB | ✅ Safe |
| Use Git LFS for .csv | 10-100 MB | ✅ Safe |
| Remove node_modules from git | 200-500 MB | ✅ Safe (already ignored) |
| **Total Potential** | **226-755 MB** | ✅ Safe |

## ✅ Verification:

After cleanup, your repository should be:
- Under 250 MB for Vercel
- Still functional locally
- All essential files preserved

## 🚀 Next Steps:

1. **Commit the changes:**
   ```bash
   git add .gitignore
   git commit -m "Remove large files and update .gitignore"
   git push origin main
   ```

2. **For Vercel deployment:**
   - Deploy only `nutri-sparkle-guide-main` folder
   - Set root directory in Vercel settings
   - Update API endpoints to backend URL

3. **For backend deployment:**
   - Deploy to Railway/Render/Heroku
   - Include models and CSV files
   - Set environment variables

## ⚠️ Important Notes:

1. **Don't delete models or CSV if you need them for local development**
2. **Use Git LFS for large files instead of removing them**
3. **For Vercel, deploy frontend only - backend goes elsewhere**
4. **Always test locally after cleanup**

