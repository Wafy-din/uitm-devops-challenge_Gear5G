# Google OAuth Setup - Complete Summary

## 🎯 What Was Done

I've set up the frontend infrastructure for Google OAuth login. Here's what's ready:

### ✅ Files Created/Modified

1. **`app/api/auth/google/route.ts`** (NEW)
   - Proxies Google OAuth requests to backend
   - Redirects: Frontend → Backend → Google

2. **`.env.local`** (UPDATED)
   - Added Google OAuth environment variables template
   - Added comments for configuration

3. **`GOOGLE_OAUTH_SETUP_GUIDE.md`** (NEW)
   - Complete step-by-step setup guide
   - Backend code examples
   - Troubleshooting section

4. **`GOOGLE_OAUTH_CHECKLIST.md`** (NEW)
   - Quick 5-minute setup checklist
   - Common issues and fixes

### ✅ Already Existing (Working)

1. **`components/ModalEmailCheck.tsx`**
   - "Sign in with Google" button already implemented
   - Click handler: `window.location.href = '/api/auth/google'`

2. **`app/auth/callback/page.tsx`**
   - Handles OAuth callback from backend
   - Stores token in localStorage and cookies
   - Validates token and redirects to homepage

---

## 🔄 OAuth Flow

```
USER CLICKS "Sign in with Google"
          ↓
Frontend: /api/auth/google (Next.js API route)
          ↓
Backend: /api/auth/google (Your backend)
          ↓
Google: OAuth consent screen
          ↓
User approves
          ↓
Backend: /api/auth/google/callback?code=xxx
          ↓
Backend: Exchange code for user info
          ↓
Backend: Create/find user in database
          ↓
Backend: Generate JWT token
          ↓
Frontend: /auth/callback?token=xxx&provider=google
          ↓
Frontend: Store token, validate, redirect to homepage
          ↓
USER IS LOGGED IN ✅
```

---

## 📋 What You Need to Do Next

### Step 1: Get Google OAuth Credentials (5 minutes)

1. **Go to Google Cloud Console:**
   https://console.cloud.google.com/

2. **Create OAuth Client ID:**
   - Create new project "RentVerse"
   - APIs & Services → Credentials
   - Create OAuth 2.0 Client ID
   - Application type: Web application

3. **Add Redirect URIs:**
   ```
   https://rentverse-backend-emqy.onrender.com/api/auth/google/callback
   http://localhost:8000/api/auth/google/callback
   http://localhost:3000/auth/callback
   ```

4. **Copy Credentials:**
   - Client ID (looks like: `123456-abc.apps.googleusercontent.com`)
   - Client Secret (looks like: `GOCSPX-abc123`)

### Step 2: Configure Backend (3 minutes)

1. **Go to Render Dashboard:**
   https://dashboard.render.com/

2. **Find your backend service**

3. **Add Environment Variables:**
   ```
   GOOGLE_CLIENT_ID = your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET = GOCSPX-your-secret
   GOOGLE_CALLBACK_URL = https://rentverse-backend-emqy.onrender.com/api/auth/google/callback
   FRONTEND_URL = http://localhost:3000
   JWT_SECRET = your-secret-jwt-key
   ```

4. **Save and Redeploy**

### Step 3: Verify Backend Routes (Check if exists)

Your backend needs these routes implemented:

- `GET /api/auth/google` - Initiates OAuth
- `GET /api/auth/google/callback` - Handles OAuth callback

**Check by visiting:**
https://rentverse-backend-emqy.onrender.com/api/auth/google

**Expected behavior:**
- Should redirect to Google login screen
- Or return an error if not implemented

### Step 4: Test the Flow (2 minutes)

1. **Start frontend:**
   ```bash
   cd rentverse-frontend
   npx next dev
   ```

2. **Go to auth page:**
   http://localhost:3000/auth

3. **Click "Sign in with Google"**

4. **Expected result:**
   - Redirects to Google
   - You approve permissions
   - Redirects back to homepage
   - You're logged in (profile picture shows)

---

## 🐛 Current Error: 404 Page

**What's happening:**
When you click "Sign in with Google", you're seeing a 404 error page.

**Possible causes:**

### Cause 1: Backend Routes Not Implemented ⚠️ MOST LIKELY
Your backend doesn't have Google OAuth routes yet.

**Fix:** Implement backend routes (see guide)

**Check:**
```bash
curl https://rentverse-backend-emqy.onrender.com/api/auth/google
```

If this returns 404, routes don't exist.

### Cause 2: Backend Environment Variables Missing
Google OAuth credentials not configured on Render.

**Fix:** Add env vars to Render dashboard (Step 2 above)

### Cause 3: Backend Server Asleep
Render free tier sleeps after 15 minutes of inactivity.

**Fix:** Wait 60 seconds for backend to wake up, try again

---

## 💻 Backend Implementation (If Not Done)

If your backend doesn't have Google OAuth, here's the minimal code:

### Install Dependencies
```bash
npm install passport passport-google-oauth20 jsonwebtoken
```

### Create Routes (routes/auth.js)
```javascript
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const jwt = require('jsonwebtoken')

// Configure Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    // Find or create user
    let user = await User.findOne({ email: profile.emails[0].value })
    
    if (!user) {
      user = await User.create({
        email: profile.emails[0].value,
        name: profile.displayName,
        profilePicture: profile.photos[0].value,
        authProvider: 'google'
      })
    }
    
    return done(null, user)
  }
))

// Route 1: Start OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}))

// Route 2: OAuth Callback
router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&provider=google`)
  }
)
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Google OAuth credentials created
- [ ] Backend environment variables added on Render
- [ ] Backend routes implemented (check with curl)
- [ ] Frontend starts without errors: `npx next dev`
- [ ] Clicking "Sign in with Google" redirects to Google
- [ ] After approval, redirects back to homepage
- [ ] User is logged in (profile picture visible)
- [ ] Token stored in localStorage
- [ ] Token stored in cookies

---

## 📞 Quick Debugging

### Check Frontend API Route
```bash
curl http://localhost:3000/api/auth/google
```
Should redirect to backend URL

### Check Backend Route
```bash
curl https://rentverse-backend-emqy.onrender.com/api/auth/google
```
Should redirect to Google OAuth URL

### Check Backend Environment
```bash
# In Render dashboard, check these env vars exist:
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_CALLBACK_URL
FRONTEND_URL
JWT_SECRET
```

### Check Browser Console
```javascript
// After clicking Google button, check console logs:
// Should see: [ModalEmailCheck] Redirecting to /api/auth/google
```

---

## 🎓 Resources

- **Full Setup Guide:** `GOOGLE_OAUTH_SETUP_GUIDE.md`
- **Quick Checklist:** `GOOGLE_OAUTH_CHECKLIST.md`
- **Google Console:** https://console.cloud.google.com/
- **Render Dashboard:** https://dashboard.render.com/

---

## 🚀 Next Steps

1. ✅ Frontend setup (DONE - this is complete)
2. ⏳ Get Google OAuth credentials from Cloud Console
3. ⏳ Add credentials to backend environment variables
4. ⏳ Verify/implement backend OAuth routes
5. ⏳ Test complete flow
6. ⏳ Deploy to production with HTTPS URLs

---

**Status:** Frontend ready, backend needs configuration ✅

**Your Action Required:**
1. Create Google OAuth credentials (5 min)
2. Add to Render backend environment (3 min)
3. Verify backend routes exist (1 min)
4. Test! (2 min)

**Total Time:** ~15 minutes

---

**Need help with backend implementation?**
Check `GOOGLE_OAUTH_SETUP_GUIDE.md` for complete backend code examples.
