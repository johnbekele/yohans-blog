# Password Reset & Change Password Setup

## 🔐 Features Implemented

1. **Logout** - Clear authentication tokens
2. **Forgot Password** - Request password reset via email
3. **Reset Password** - Set new password using reset token
4. **Change Password** - Update password for authenticated users

## 📧 SMTP Configuration

### Google SMTP Setup

1. **Enable 2-Step Verification** on your Google account
2. **Generate App Password**:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Copy the 16-character password

3. **Add to `.env` file**:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
FRONTEND_URL=http://localhost:5174
```

### For Production:
```env
FRONTEND_URL=https://yourdomain.com
```

## 🚀 Usage

### Forgot Password Flow:
1. User clicks "Forgot password?" on login page
2. Enters email address
3. Receives email with reset link (valid for 1 hour)
4. Clicks link → redirected to reset password page
5. Enters new password
6. Password updated, confirmation email sent

### Change Password Flow:
1. User logs in to admin panel
2. Navigates to Settings (`/admin/settings`)
3. Enters current password and new password
4. Password updated, confirmation email sent

### Logout:
- Already implemented in frontend
- Clears tokens from localStorage
- Backend endpoint available at `/api/auth/logout` (for logging)

## 📝 API Endpoints

### Authentication
- `POST /api/auth/logout` - Logout (clears client tokens)
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/change-password` - Change password (authenticated)

### Request Examples

**Forgot Password:**
```json
POST /api/auth/forgot-password
{
  "email": "user@example.com"
}
```

**Reset Password:**
```json
POST /api/auth/reset-password
{
  "token": "reset_token_from_email",
  "new_password": "newpassword123"
}
```

**Change Password:**
```json
POST /api/auth/change-password
Headers: Authorization: Bearer <token>
{
  "current_password": "oldpassword",
  "new_password": "newpassword123"
}
```

## 🎨 Frontend Routes

- `/forgot-password` - Request password reset
- `/reset-password?token=...` - Reset password with token
- `/admin/settings` - Change password (authenticated)

## 🔒 Security Features

- ✅ Reset tokens expire in 1 hour
- ✅ Tokens are JWT-based and signed
- ✅ Password validation (min 6 characters)
- ✅ Current password verification for change
- ✅ Email confirmation on password changes
- ✅ Prevents email enumeration (always returns success)

## 📧 Email Templates

Beautiful HTML emails are sent for:
- Password reset requests
- Password changed confirmations

Emails include:
- Professional styling
- Clear call-to-action buttons
- Security warnings
- Frontend URL links (from env)

## ⚙️ Environment Variables

Add these to your `backend/.env`:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5174
```

## 🧪 Testing

1. **Test Forgot Password:**
   - Go to `/login`
   - Click "Forgot password?"
   - Enter email
   - Check email inbox
   - Click reset link
   - Set new password

2. **Test Change Password:**
   - Login to admin
   - Go to `/admin/settings`
   - Enter current and new password
   - Verify success message

3. **Test Logout:**
   - Click logout (if button exists)
   - Or manually clear localStorage
   - Verify redirect to login

## 🐛 Troubleshooting

**Email not sending:**
- Check SMTP credentials in `.env`
- Verify app password is correct (not regular password)
- Check SMTP_HOST and SMTP_PORT
- Check firewall/network restrictions

**Reset link not working:**
- Verify FRONTEND_URL matches your frontend URL
- Check token hasn't expired (1 hour limit)
- Verify token is passed correctly in URL

**Password change fails:**
- Verify current password is correct
- Check new password meets requirements (6+ chars)
- Ensure user is authenticated

