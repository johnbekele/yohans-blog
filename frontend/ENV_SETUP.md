# Frontend Environment Setup

Create a `.env` file in the `frontend/` directory with the following variable:

```env
# API Configuration
VITE_API_URL=http://localhost:8000/api
```

## Required Variables:
- `VITE_API_URL`: Base URL for the backend API (without trailing slash)

## Production:
For production, set `VITE_API_URL` to your production API URL:
```env
VITE_API_URL=https://api.yourdomain.com/api
```

