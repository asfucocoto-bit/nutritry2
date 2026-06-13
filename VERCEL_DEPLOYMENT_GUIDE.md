# Vercel Deployment Guide - Reducing Repository Size

## ⚠️ Important Note

**Vercel is for frontend/Node.js applications only.** Your Flask backend cannot run on Vercel. You need to:
1. **Deploy Frontend** → Vercel (React app)
2. **Deploy Backend** → Railway, Render, Heroku, or similar (Flask API)

## 📦 Files Safe to Remove/Exclude

### 1. Files That Can Be Deleted (Not Needed in Git)

These files can be safely removed from the repository:

#### Already in .gitignore (but might be tracked):
- `__pycache__/` - Python cache (should be ignored)
- `node_modules/` - Node dependencies (should be ignored)
- `*.db` - Database files (should be ignored)

#### Can be removed from Git:
- `nutri-sparkle-guide-main/bun.lockb` - Bun lock file (not needed if using npm/yarn)
- `nutri-sparkle-guide-main/src/123456-modified.png` - Unnecessary image file
- `database/diet_users.db` - Local database (if exists)
- `database/diet.db` - Local database (if exists)

### 2. Large Files That Are Needed But Can Be Optimized

#### Option A: Use Git LFS (Git Large File Storage)
For large files like models and CSV data:
```bash
# Install Git LFS
git lfs install

# Track large files
git lfs track "*.pkl"
git lfs track "data/*.csv"
git lfs track "*.lockb"

# Commit the .gitattributes file
git add .gitattributes
```

#### Option B: Move to External Storage (Recommended)
- Upload `.pkl` model files to cloud storage (AWS S3, Cloudinary, etc.)
- Upload CSV files to a database or cloud storage
- Download them at runtime or during deployment

#### Option C: Generate on First Run
- Models can be regenerated using `scripts/train_model.py`
- Data can be preprocessed using `scripts/preprocess_data.py`
- Add this to your deployment build process

## 🗑️ Step-by-Step Cleanup

### Step 1: Remove Unnecessary Files

```bash
# Remove bun.lockb (if not using Bun)
git rm nutri-sparkle-guide-main/bun.lockb

# Remove unnecessary image
git rm nutri-sparkle-guide-main/src/123456-modified.png

# Remove local database files (if tracked)
git rm database/*.db
```

### Step 2: Update .gitignore

Add these to your `.gitignore`:

```gitignore
# Large binary files
*.lockb
bun.lockb

# Large data files (optional - use Git LFS instead)
# data/nutritions.csv
# data/processed_diet.csv

# Model files (optional - use Git LFS or external storage)
# models/*.pkl

# Large images
*.png
*.jpg
*.jpeg
!public/**/*.png
!public/**/*.jpg
```

### Step 3: Remove Files from Git History (if already committed)

```bash
# Remove large files from git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch nutri-sparkle-guide-main/bun.lockb" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (WARNING: This rewrites history)
git push origin --force --all
```

## 🚀 Deployment Strategy

### Frontend Deployment (Vercel)

1. **Create a separate frontend repository** or use a monorepo structure
2. Deploy only the `nutri-sparkle-guide-main` directory
3. Update API endpoints to point to your backend URL

### Backend Deployment (Railway/Render/Heroku)

1. Deploy Flask app separately
2. Store models and data files:
   - Option 1: Include in deployment (if small enough)
   - Option 2: Download from cloud storage on startup
   - Option 3: Generate models during deployment

## 📊 Estimated Size Reduction

- `bun.lockb`: ~5-50 MB
- `*.png` images: ~1-5 MB each
- `*.pkl` models: ~10-100 MB total
- `*.csv` data: ~5-50 MB total
- `node_modules/`: ~200-500 MB (should never be in git)

**Total potential reduction: 200-700 MB**

## ✅ Recommended Approach

1. **Remove from Git:**
   - `bun.lockb`
   - Unnecessary images
   - Local database files

2. **Use Git LFS for:**
   - Model files (`.pkl`)
   - Large CSV files

3. **Deploy separately:**
   - Frontend → Vercel
   - Backend → Railway/Render

4. **Alternative:** Use external storage for models and data, download at runtime

## 🔧 Quick Fix Script

Run this script to clean up:

```bash
# Remove bun.lockb
git rm --cached nutri-sparkle-guide-main/bun.lockb 2>/dev/null || true

# Remove unnecessary images
git rm --cached nutri-sparkle-guide-main/src/123456-modified.png 2>/dev/null || true

# Remove database files
git rm --cached database/*.db 2>/dev/null || true

# Update .gitignore
echo "*.lockb" >> .gitignore
echo "bun.lockb" >> .gitignore

# Commit changes
git add .gitignore
git commit -m "Remove large files and update .gitignore"
```

