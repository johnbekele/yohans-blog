# 🚀 Quick Start Guide

Get your blog portfolio running in 5 minutes!

## Prerequisites Check

✅ Python 3.11+ installed
✅ Node.js 18+ installed  
✅ MongoDB Atlas account (free tier) OR local MongoDB

## Step 1: MongoDB Setup (2 minutes)

### Option A: MongoDB Atlas (Recommended)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free
3. Create a new cluster (M0 Free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password

Your URI will look like:
```
mongodb+srv://username:password@cluster.mongodb.net/blog_db?retryWrites=true&w=majority
```

### Option B: Local MongoDB

If you have MongoDB installed locally:
```
mongodb://localhost:27017/blog_db
```

## Step 2: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd blog-site/backend

# Create virtual environment (Windows)
python -m venv venv
venv\Scripts\activate

# OR on Mac/Linux
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy and edit)
# Windows:
copy .env.example .env
# Mac/Linux:
cp .env.example .env

# Edit .env - IMPORTANT: Add your MongoDB URI!
# Use notepad, VS Code, or any text editor
# Replace the MONGODB_URI with your actual URI from Step 1
```

Your `.env` should look like:
```env
MONGODB_URI=mongodb+srv://your-actual-uri-here
JWT_SECRET_KEY=your-secret-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

```bash
# Seed the database with portfolio data and admin user
python seed_db.py

# Start the backend server
uvicorn app.main:app --reload
```

✅ Backend running at: http://localhost:8000
✅ API docs at: http://localhost:8000/docs

## Step 3: Frontend Setup (1 minute)

Open a NEW terminal (keep backend running):

```bash
# Navigate to frontend
cd blog-site/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend running at: http://localhost:5173

## Step 4: Login & Test!

1. Open browser: http://localhost:5173
2. Click "Login" button
3. Use default credentials:
   - **Email**: admin@blog.com
   - **Password**: admin123
4. You'll be redirected to Admin Dashboard
5. Click "New Post" to create your first blog post!

## 🎉 You're Done!

### What You Have Now:

- ✅ Full-stack blog platform running locally
- ✅ Admin dashboard at `/admin`
- ✅ Portfolio page with your info at `/portfolio`
- ✅ Blog posts page at `/blog`
- ✅ Authentication system

### Next Steps:

1. **Create Your First Post**
   - Go to http://localhost:5173/admin
   - Click "New Post"
   - Write your content (Markdown supported!)
   - Click "Create Post"

2. **Update Portfolio Data**
   - Edit `backend/seed_db.py`
   - Modify personal_info, skills, projects, experience
   - Rerun: `python seed_db.py`

3. **Change Admin Password**
   - In backend code or database
   - Security best practice!

## 🆘 Troubleshooting

### Backend won't start?

**Check Python version:**
```bash
python --version  # Should be 3.11+
```

**MongoDB connection error?**
- Verify `.env` has correct `MONGODB_URI`
- Check MongoDB Atlas IP whitelist (set to 0.0.0.0/0 for development)
- Ensure database user password is correct

**Module not found error?**
```bash
pip install -r requirements.txt --force-reinstall
```

### Frontend won't start?

**Check Node version:**
```bash
node --version  # Should be 18+
```

**Port already in use?**
```bash
# Change port in package.json:
"dev": "vite --port 3000"
```

**npm install fails?**
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Can't login?

**Did you run the seed script?**
```bash
cd backend
python seed_db.py
```

**Check backend is running:**
- Visit http://localhost:8000/health
- Should see `{"status":"healthy"}`

**CORS error in browser console?**
- Check backend `.env` has `CORS_ORIGINS=http://localhost:5173`
- Restart backend server

### Posts not showing?

**Create a test post:**
1. Login to admin
2. Create a post
3. Check "Publish immediately"
4. Save

**Check API directly:**
- Visit http://localhost:8000/api/posts
- Should see JSON response with posts

## 📱 Testing on Mobile

```bash
# Find your local IP (Windows)
ipconfig

# Find your local IP (Mac/Linux)
ifconfig

# Update frontend .env
VITE_API_URL=http://YOUR_LOCAL_IP:8000/api

# Update backend .env CORS_ORIGINS
CORS_ORIGINS=http://YOUR_LOCAL_IP:5173

# Restart both servers
# Access from phone: http://YOUR_LOCAL_IP:5173
```

## 🚀 Ready to Deploy?

See the main [README.md](./README.md) for deployment instructions to:
- Vercel (Frontend)
- Render/Railway (Backend)
- MongoDB Atlas (Database)

## 💡 Tips

1. **Keep both terminals open** while developing
2. **Backend changes** require server restart (unless using `--reload`)
3. **Frontend changes** auto-reload in browser
4. **Database changes** need seed script rerun
5. **Use the API docs** at http://localhost:8000/docs to test endpoints

## 📚 Learn More

- [Implementation Plan](./implementation_plan.md) - Architecture details
- [Backend README](./backend/README.md) - API documentation
- [Main README](./README.md) - Full documentation

---

**Need Help?** 
- Check the main README.md
- Open an issue on GitHub
- Contact: yohans.Bekele@thomsonreuters.com

**Enjoying the project?** ⭐ Star it on GitHub!

