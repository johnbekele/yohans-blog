# Backend Environment Setup

Create a `.env` file in the `backend/` directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=blog_portfolio

# JWT Authentication
JWT_SECRET_KEY=your-secret-key-here-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Thomson Reuters GPT API
TR_GPT_TOKEN=your_esso_token_here

# SMTP Email Configuration (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5174

# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:5174,http://localhost:3000

# Application Settings
APP_NAME=Blog Portfolio API
APP_VERSION=1.0.0
DEBUG=True
```

## Required Variables:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET_KEY`: Secret key for JWT token signing (use a strong random string)
- `TR_GPT_TOKEN`: Your Thomson Reuters ESSO token (optional, only needed for AI blog generation)

## Optional Variables:
- `DATABASE_NAME`: Defaults to "blog_portfolio"
- `CORS_ORIGINS`: Comma-separated list of allowed origins

