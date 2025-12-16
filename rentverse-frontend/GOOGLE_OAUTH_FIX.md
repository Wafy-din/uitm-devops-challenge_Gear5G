# 🔴 URGENT FIX: Google OAuth redirect_uri_mismatch

## Problem Identified

The error **"Error 400: redirect_uri_mismatch"** occurs because the backend is sending the wrong redirect URI to Google.

---

## 🔍 Root Cause

**Backend Configuration Error:**

In your backend `.env` file:
```env
BASE_URL=http://localhost:3000  ❌ WRONG
```

The backend uses `BASE_URL` to construct the Google OAuth callback URL:
```javascript
callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`
```

**Result:** 
Google receives: `http://localhost:3000/api/auth/google/callback`

But your backend is actually running on Render at:
`https://rentverse-backend-emqy.onrender.com`

---

## ✅ SOLUTION

### Fix 1: Update Backend Environment Variables on Render

1. **Go to Render Dashboard:**
   https://dashboard.render.com/

2. **Find your backend service:** `rentverse-backend`

3. **Go to Environment tab**

4. **Update/Add these variables:**

   ```env
   BASE_URL=https://rentverse-backend-emqy.onrender.com
   FRONTEND_URL=http://localhost:3000
   
   GOOGLE_CLIENT_ID=265516962418-h8gn7kmaopg7gi66qivqk7j8mmv75hgp.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=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
   ```

5. **Save Changes** (Render will auto-redeploy)

---

### Fix 2: Update Google Cloud Console Redirect URIs

1. **Go to Google Cloud Console:**
   https://console.cloud.google.com/apis/credentials

2. **Find your OAuth 2.0 Client ID:**
   - Client ID: `265516962418-h8gn7kmaopg7gi66qivqk7j8mmv75hgp.apps.googleusercontent.com`

3. **Click Edit (pencil icon)**

4. **Under "Authorized redirect URIs", ADD these URIs:**

   ```
   https://rentverse-backend-emqy.onrender.com/api/auth/google/callback
   http://localhost:3000/api/auth/google/callback
   http://localhost:8000/api/auth/google/callback
   ```

5. **Remove any incorrect URIs** (if they exist)

6. **Click Save**

7. **IMPORTANT:** Wait 5 minutes for Google to propagate changes

---

## 🧪 Test After Fixing

### Step 1: Verify Backend Environment
```bash
# Check if BASE_URL is updated on Render
# Go to: https://dashboard.render.com/web/<your-service>/env
# Verify: BASE_URL=https://rentverse-backend-emqy.onrender.com
```

### Step 2: Test Backend Endpoint

Visit this URL in your browser:
```
https://rentverse-backend-emqy.onrender.com/api/auth/google
```

**Expected Result:**
- Should redirect to Google OAuth consent screen
- If it shows 404, wait for backend to wake up (60 seconds)

### Step 3: Test Full Flow

1. Start frontend:
   ```bash
   cd rentverse-frontend
   npx next dev
   ```

2. Go to: http://localhost:3000/auth

3. Click **"Sign in with Google"**

4. **Expected Flow:**
   - Redirects to Google login
   - You approve permissions
   - Redirects back to: `http://localhost:3000/auth/callback?token=xxx&provider=google`
   - Automatically redirects to homepage
   - You're logged in!

---

## 📋 Complete Configuration Reference

### Backend Environment Variables (Render)

```env
# Database
DATABASE_URL=postgresql://rentverse_db_lsoe_user:xxx@xxx.oregon-postgres.render.com/rentverse_db_lsoe

# Server URLs
BASE_URL=https://rentverse-backend-emqy.onrender.com
FRONTEND_URL=http://localhost:3000
PORT=8000

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=265516962418-h8gn7kmaopg7gi66qivqk7j8mmv75hgp.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# Cloudinary (if using image uploads)
CLOUDINARY_CLOUD_NAME=dk2mshppk
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Google Cloud Console Redirect URIs

```
https://rentverse-backend-emqy.onrender.com/api/auth/google/callback
http://localhost:3000/api/auth/google/callback
http://localhost:8000/api/auth/google/callback
```

### Frontend Environment Variables (.env.local)

```env
NEXT_PUBLIC_API_BASE_URL=https://rentverse-backend-emqy.onrender.com
NEXT_PUBLIC_MAPTILER_API_KEY=tQACIqGlhF51rQlqRxIJ
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dk2mshppk
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=rentverse_unsigned
```

---

## 🎯 Quick Summary

**Problem:** Backend sending wrong callback URL to Google

**Fix:**
1. ✅ Update Render env: `BASE_URL=https://rentverse-backend-emqy.onrender.com`
2. ✅ Update Google Console: Add `https://rentverse-backend-emqy.onrender.com/api/auth/google/callback`
3. ✅ Wait 5 minutes
4. ✅ Test login flow

**Time Required:** 5 minutes + 5 minutes wait for Google propagation

---

## 🐛 Still Not Working?

### Error: "redirect_uri_mismatch"
- Check Google Console has EXACT URI (no trailing slash)
- Wait 5-10 minutes after updating Google Console
- Clear browser cache
- Try incognito mode

### Error: 404 on /api/auth/google
- Backend is sleeping (Render free tier)
- Wait 60 seconds for backend to wake up
- Visit https://rentverse-backend-emqy.onrender.com/api/properties first

### Error: "Invalid token"
- Check JWT_SECRET is set on Render
- Check backend logs for errors

### Error: Backend doesn't redirect
- Check FRONTEND_URL is set to `http://localhost:3000`
- Check backend code in `routes/auth.js` line 1080

---

## 📞 Debugging Commands

### Check if backend is awake
```bash
curl https://rentverse-backend-emqy.onrender.com/api/properties
```

### Check Google OAuth endpoint
```bash
# In browser, visit:
https://rentverse-backend-emqy.onrender.com/api/auth/google
# Should redirect to Google
```

### Check environment variables on Render
1. Go to Render dashboard
2. Select your backend service
3. Click "Environment" tab
4. Verify BASE_URL value

---

**Next Action:** Update `BASE_URL` on Render and Google redirect URIs, then test!
