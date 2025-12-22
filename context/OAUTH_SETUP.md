# OAuth Setup Guide

## Backend Configuration

Add these environment variables to your `.env` file or Render dashboard:

```env
OAUTH_CLIENT_ID=your-google-client-id
OAUTH_CLIENT_SECRET=your-google-client-secret
OAUTH_REDIRECT_URI=https://your-frontend-url.com/oauth/callback
FRONTEND_URL=https://your-frontend-url.com
```

For local development:
```env
OAUTH_REDIRECT_URI=http://localhost:5174/oauth/callback
FRONTEND_URL=http://localhost:5174
```

**IMPORTANT**: The `OAUTH_REDIRECT_URI` must match EXACTLY what you configure in Google Cloud Console (including http/https, trailing slashes, etc.)

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API (or OAuth 2.0 API)
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized redirect URIs (must match exactly):
   - `http://localhost:5174/oauth/callback` (for local - no trailing slash)
   - `https://your-frontend-url.com/oauth/callback` (for production - no trailing slash)
7. Copy Client ID and Client Secret
8. Add them to your environment variables

## How It Works

1. User clicks "Sign in with Google" button
2. Redirects to Google OAuth consent screen
3. User authorizes the app
4. Google redirects back with authorization code
5. Backend exchanges code for user info
6. Backend creates/updates user and returns JWT tokens
7. Frontend stores tokens and logs user in

## Features

- Automatic user creation on first OAuth login
- Links OAuth account to existing email if user exists
- Returns standard JWT tokens (same as email/password login)
- Clean, minimal implementation

## Troubleshooting

### "OAuth authentication failed" Error

**Most common issue: Redirect URI mismatch**

1. Check that `OAUTH_REDIRECT_URI` in your environment matches EXACTLY what's in Google Cloud Console
2. Verify no trailing slashes: Use `/oauth/callback` not `/oauth/callback/`
3. Check protocol: Use `https://` for production, `http://` for local
4. Check the error message in the browser console for specific Google error details

**Check your configuration:**
- Backend `OAUTH_REDIRECT_URI` = `https://your-frontend-url.com/oauth/callback`
- Google Cloud Console authorized redirect URI = `https://your-frontend-url.com/oauth/callback`
- They must be identical (case-sensitive, no extra spaces)

**Common errors:**
- `redirect_uri_mismatch`: Redirect URI doesn't match Google Cloud Console
- `invalid_grant`: Code already used or expired (try again)
- `invalid_client`: Client ID or secret is incorrect

### Debug Steps

1. Check browser console for detailed error messages
2. Verify environment variables are set correctly
3. Ensure `FRONTEND_URL` is set correctly
4. Test with the exact redirect URI from Google Cloud Console

