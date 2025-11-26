# Blog Portfolio Project

A full-stack blog platform integrated with a professional portfolio, featuring modern UI, authentication, and admin dashboard.

## 🚀 Features

### Blog System
- ✅ Create, read, update, delete blog posts
- ✅ Markdown support with syntax highlighting
- ✅ Categories and tags
- ✅ Search functionality
- ✅ Pagination
- ✅ View counter
- ✅ Reading time estimation

### Portfolio Integration
- ✅ Personal information display
- ✅ Skills showcase with progress bars
- ✅ Projects gallery with links
- ✅ Work experience timeline
- ✅ Contact information

### Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Admin dashboard
- ✅ Protected routes
- ✅ Token refresh mechanism

### UI/UX
- ✅ Dark/Light theme toggle
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Modern animations with Framer Motion
- ✅ Beautiful gradient accents
- ✅ Font Awesome icons

## 📁 Project Structure

```
blog-portfolio-project/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── models/         # Pydantic models
│   │   ├── schemas/        # Request/response schemas
│   │   ├── routes/         # API endpoints
│   │   ├── utils/          # Helper functions
│   │   └── middleware/     # Auth middleware
│   ├── requirements.txt    # Python dependencies
│   └── seed_db.py         # Database seeding script
│
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── context/       # React context
│   │   └── styles/        # CSS files
│   └── package.json       # Node dependencies
│
└── implementation_plan.md  # Detailed architecture document
```

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB (Motor async driver)
- **Authentication**: JWT (python-jose)
- **Password Hashing**: Passlib with bcrypt
- **Validation**: Pydantic

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + DaisyUI
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Markdown**: React Markdown
- **Syntax Highlighting**: React Syntax Highlighter
- **Icons**: Font Awesome
- **Animations**: Framer Motion

## 📦 Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
```

3. Activate virtual environment:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create `.env` file:
```bash
# Copy example file
cp .env.example .env

# Edit .env with your MongoDB URI and secrets
```

6. Seed the database:
```bash
python seed_db.py
```

7. Run development server:
```bash
uvicorn app.main:app --reload
```

Backend will be running at: `http://localhost:8000`
API docs available at: `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
# The file should contain:
VITE_API_URL=http://localhost:8000/api
```

4. Run development server:
```bash
npm run dev
```

Frontend will be running at: `http://localhost:5173`

## 🔐 Default Admin Credentials

After running the seed script:
- **Email**: `admin@blog.com`
- **Password**: `admin123`

⚠️ **IMPORTANT**: Change these credentials in production!

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

### Blog Posts
- `GET /api/posts` - Get all posts (with pagination)
- `GET /api/posts/{slug}` - Get single post
- `POST /api/posts` - Create post (admin only)
- `PUT /api/posts/{slug}` - Update post (admin only)
- `DELETE /api/posts/{slug}` - Delete post (admin only)
- `GET /api/posts/tags/all` - Get all tags
- `GET /api/posts/categories/all` - Get all categories

### Portfolio
- `GET /api/portfolio` - Get complete portfolio
- `GET /api/portfolio/info` - Get personal info
- `GET /api/portfolio/skills` - Get skills
- `GET /api/portfolio/projects` - Get projects
- `GET /api/portfolio/experience` - Get experience

## 🚢 Deployment

### Backend Deployment (Render/Railway)

1. Create account on Render.com or Railway.app
2. Connect GitHub repository
3. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET_KEY`
   - `CORS_ORIGINS` (your frontend URL)
4. Deploy!

### Frontend Deployment (Vercel/Netlify)

1. Create account on Vercel.com or Netlify.com
2. Connect GitHub repository
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Set environment variable:
   - `VITE_API_URL` (your backend URL)
6. Deploy!

### MongoDB Atlas Setup

1. Create account at mongodb.com/cloud/atlas
2. Create a new cluster (free tier available)
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all)
5. Get connection string
6. Replace in backend `.env`

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 📚 Usage Guide

### Creating a Blog Post

1. Login at `/login` with admin credentials
2. Navigate to `/admin`
3. Click "New Post"
4. Fill in:
   - Title
   - Excerpt (short summary)
   - Content (Markdown supported)
   - Category
   - Tags (comma-separated)
   - Featured image URL (optional)
5. Check "Publish immediately" or save as draft
6. Click "Create Post"

### Markdown Support

Posts support full Markdown syntax:

```markdown
# Heading 1
## Heading 2

**Bold text**
*Italic text*

- List item 1
- List item 2

\`inline code\`

\`\`\`python
# Code block
def hello():
    print("Hello, World!")
\`\`\`

[Link text](https://example.com)

![Image alt](image-url.jpg)
```

## 🎨 Customization

### Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  'accent-cyan': '#00d9ff',    // Primary accent
  'accent-lime': '#ccff00',    // Secondary accent
  'bg-primary': '#0a0e1a',     // Background
  'bg-secondary': '#151925',   // Card background
}
```

### Portfolio Data

Edit portfolio data by:
1. Modifying `backend/seed_db.py`
2. Rerunning the seed script
3. OR create an admin interface to edit portfolio (future enhancement)

## 🔒 Security Best Practices

1. **Never commit `.env` files**
2. **Use strong JWT secrets** (generate with: `openssl rand -hex 32`)
3. **Change default admin password** immediately
4. **Enable CORS only for trusted domains** in production
5. **Use HTTPS** in production
6. **Keep dependencies updated**
7. **Run security scans** regularly

## 🐛 Troubleshooting

### Backend Issues

**MongoDB connection fails:**
- Check MongoDB URI format
- Verify IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

**CORS errors:**
- Add frontend URL to `CORS_ORIGINS` in `.env`
- Restart backend server

### Frontend Issues

**API calls fail:**
- Verify `VITE_API_URL` in `.env`
- Check backend is running
- Check browser console for errors

**Build fails:**
- Clear node_modules: `rm -rf node_modules`
- Reinstall: `npm install`
- Clear cache: `npm cache clean --force`

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Yohans (John) Bekele**
- GitHub: [@johnbekele](https://github.com/johnbekele)
- LinkedIn: [Yohans Bekele](https://www.linkedin.com/in/yohans-bekele)
- Email: yohans.Bekele@thomsonreuters.com

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

**Made with ❤️ using React, FastAPI, and MongoDB**

