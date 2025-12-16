# Google OAuth Setup Guide for RentVerse

## Overview
This guide will help you set up Google Sign-In for your RentVerse application.

---

## 📋 Prerequisites

1. Google Cloud Console account
2. Backend server running (Render or local)
3. Frontend application (Next.js)

---

## 🔧 Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 1.2 Create or Select a Project
- Click on the project dropdown at the top
- Click "New Project" or select existing project
- Name it: **RentVerse** (or your preferred name)

### 1.3 Enable Google+ API
1. Go to **APIs & Services** > **Library**
2. Search for "Google+ API" or "Google Identity"
3. Click **Enable**

### 1.4 Create OAuth 2.0 Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. If prompted, configure the OAuth consent screen first:
   - **User Type:** External
   - **App name:** RentVerse
   - **User support email:** Your email
   - **Developer contact:** Your email
   - **Scopes:** Add `email`, `profile`, `openid`
   - **Test users:** Add your email for testing
   - Click **Save and Continue**

4. Back to Create OAuth client ID:
   - **Application type:** Web application
   - **Name:** RentVerse Web Client
   
5. **Authorized JavaScript origins:**
   ```
   http://localhost:3000
   https://your-frontend-domain.vercel.app
   ```

6. **Authorized redirect URIs:**
   ```
   http://localhost:8000/api/auth/google/callback
   https://rentverse-backend-emqy.onrender.com/api/auth/google/callback
   http://localhost:3000/auth/callback
   https://your-frontend-domain.vercel.app/auth/callback
   ```

7. Click **Create**

### 1.5 Copy Credentials
- **Client ID:** Copy this (looks like: `123456789-abc123.apps.googleusercontent.com`)
- **Client Secret:** Copy this (looks like: `GOCSPX-abc123def456`)

---

## 🔐 Step 2: Configure Backend (Render/Node.js)

### 2.1 Update Backend Environment Variables

Go to your Render dashboard (or local `.env` file):

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-client-secret
GOOGLE_CALLBACK_URL=https://rentverse-backend-emqy.onrender.com/api/auth/google/callback

# Frontend URL (for redirect after auth)
FRONTEND_URL=http://localhost:3000
# Or for production:
# FRONTEND_URL=https://your-frontend-domain.vercel.app

# JWT Secret (if not already set)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 2.2 Backend Google OAuth Routes (Check if exists)

Your backend needs these routes:

**Route 1:** `GET /api/auth/google`
- Initiates Google OAuth flow
- Redirects to Google consent screen

**Route 2:** `GET /api/auth/google/callback`
- Receives Google OAuth callback
- Exchanges code for tokens
- Creates/updates user in database
- Generates JWT token
- Redirects to frontend with token: `/auth/callback?token=xxx&provider=google`

### 2.3 Install Backend Dependencies (if needed)

```bash
cd rentverse-backend
npm install passport passport-google-oauth20 jsonwebtoken
```

---

## 🎨 Step 3: Configure Frontend (Already Done!)

### 3.1 Environment Variables
Your `.env.local` has been updated with:
```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://rentverse-backend-emqy.onrender.com/api/auth/google/callback
```

**Note:** Frontend doesn't need these secrets, but they're here for reference.

### 3.2 Frontend Files Created
✅ `app/api/auth/google/route.ts` - Redirects to backend OAuth endpoint
✅ `app/auth/callback/page.tsx` - Handles OAuth callback (already exists)
✅ `components/ModalEmailCheck.tsx` - Google Sign-In button (already exists)

---

## 🚀 Step 4: How It Works

### OAuth Flow Diagram

```
1. User clicks "Sign in with Google"
   ↓
2. Frontend → /api/auth/google
   ↓
3. Redirects to Backend → /api/auth/google
   ↓
4. Backend redirects to Google OAuth consent screen
   ↓
5. User approves permissions
   ↓
6. Google redirects to Backend → /api/auth/google/callback?code=xxx
   ↓
7. Backend exchanges code for user info (email, name, profile pic)
   ↓
8. Backend creates/finds user in database
   ↓
9. Backend generates JWT token
   ↓
10. Backend redirects to Frontend → /auth/callback?token=xxx&provider=google
    ↓
11. Frontend stores token in localStorage + cookies
    ↓
12. Frontend validates token → /api/auth/validate
    ↓
13. Frontend redirects to homepage (user logged in)
```

---

## 🧪 Step 5: Testing

### 5.1 Start Development Servers

**Backend:**
```bash
cd rentverse-backend
npm run dev
# Should run on http://localhost:8000
```

**Frontend:**
```bash
cd rentverse-frontend
npm run dev
# Should run on http://localhost:3000
```

### 5.2 Test the Flow

1. Go to `http://localhost:3000/auth`
2. Click **"Sign in with Google"**
3. Should redirect to Google consent screen
4. Choose your Google account
5. Approve permissions
6. Should redirect back to homepage (logged in)

### 5.3 Verify Success

Check these:
- ✅ `localStorage.authToken` exists
- ✅ `document.cookie` contains `authToken`
- ✅ Profile icon shows your Google profile picture
- ✅ Console logs show user data

---

## 🐛 Troubleshooting

### Error: "redirect_uri_mismatch"
**Cause:** Redirect URI not added to Google Console
**Fix:** 
1. Go to Google Cloud Console > Credentials
2. Edit your OAuth client
3. Add exact redirect URI: `https://rentverse-backend-emqy.onrender.com/api/auth/google/callback`
4. Save and wait 5 minutes for changes to propagate

### Error: "access_denied"
**Cause:** User cancelled or app not approved
**Fix:** 
- Make sure OAuth consent screen is configured
- Add your email to test users
- Try again

### Error: 404 on /api/auth/google
**Cause:** Backend route not implemented
**Fix:** Check backend has Google OAuth routes implemented

### Error: "Invalid token" on callback
**Cause:** JWT validation failed
**Fix:** 
- Check `JWT_SECRET` is same on backend
- Check token expiry time
- Verify backend is generating valid JWT

### Error: Backend doesn't redirect to frontend
**Cause:** `FRONTEND_URL` not set in backend
**Fix:** Add `FRONTEND_URL=http://localhost:3000` to backend env

---

## 📝 Backend Code Example (If Not Implemented)

If your backend doesn't have Google OAuth, here's the code:

### Install Dependencies
```bash
npm install passport passport-google-oauth20 jsonwebtoken
```

### Create `routes/auth.js`
```javascript
const express = require('express')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const jwt = require('jsonwebtoken')
const router = express.Router()

// Configure Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find or create user in your database
      let user = await User.findOne({ googleId: profile.id })
      
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          profilePicture: profile.photos[0].value,
          authProvider: 'google'
        })
      }
      
      return done(null, user)
    } catch (error) {
      return done(error, null)
    }
  }
))

// Route 1: Initiate Google OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}))

// Route 2: Google OAuth Callback
router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/auth?error=oauth_failed' }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign(
      { userId: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
    res.redirect(`${frontendUrl}/auth/callback?token=${token}&provider=google`)
  }
)

module.exports = router
```

### Update `app.js` or `server.js`
```javascript
const authRoutes = require('./routes/auth')
app.use('/api/auth', authRoutes)
```

---

## ✅ Production Checklist

Before deploying to production:

- [ ] Update Google OAuth redirect URIs with production URLs
- [ ] Set `FRONTEND_URL` in backend to production domain
- [ ] Set `GOOGLE_CALLBACK_URL` to production backend URL
- [ ] Never commit `.env` files to Git
- [ ] Use environment variables in hosting platform (Vercel, Render)
- [ ] Test OAuth flow on production domain
- [ ] Enable HTTPS on both frontend and backend
- [ ] Review OAuth consent screen (logo, privacy policy, terms)
- [ ] Submit app for Google verification if needed (for >100 users)

---

## 📚 Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Google Strategy](http://www.passportjs.org/packages/passport-google-oauth20/)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

---

## 🎯 Summary

**What's Done:**
✅ Frontend Google OAuth button created
✅ Frontend API route `/api/auth/google` created
✅ Frontend callback handler `/auth/callback` exists
✅ Environment variables template added

**What You Need to Do:**
1. Create Google OAuth credentials in Cloud Console
2. Copy Client ID and Client Secret to backend environment variables
3. Verify backend has Google OAuth routes implemented
4. Test the complete flow

**Expected Behavior:**
Click "Sign in with Google" → Google login → Redirect to homepage (logged in)

---

**Last Updated:** December 16, 2025
