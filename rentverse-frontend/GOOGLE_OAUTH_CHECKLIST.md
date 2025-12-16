# Google OAuth Quick Setup Checklist

## ⚡ Quick Start (5 Minutes)

### 1. Google Cloud Console Setup
- [ ] Go to https://console.cloud.google.com/
- [ ] Create new project "RentVerse"
- [ ] Enable Google+ API
- [ ] Create OAuth 2.0 credentials
- [ ] Add redirect URIs:
  - `https://rentverse-backend-emqy.onrender.com/api/auth/google/callback`
  - `http://localhost:8000/api/auth/google/callback`
  - `http://localhost:3000/auth/callback`
- [ ] Copy Client ID and Client Secret

### 2. Backend Configuration (Render Dashboard)
- [ ] Go to Render dashboard for your backend
- [ ] Add environment variables:
  ```
  GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
  GOOGLE_CLIENT_SECRET=your-client-secret
  GOOGLE_CALLBACK_URL=https://rentverse-backend-emqy.onrender.com/api/auth/google/callback
  FRONTEND_URL=http://localhost:3000
  JWT_SECRET=your-secret-key
  ```
- [ ] Redeploy backend (or it auto-deploys)

### 3. Test It!
- [ ] Run frontend: `npm run dev`
- [ ] Go to http://localhost:3000/auth
- [ ] Click "Sign in with Google"
- [ ] Should redirect to Google → approve → redirect to homepage (logged in)

---

## 🔍 Current Status

### ✅ Frontend (Already Completed)
- ✅ Google OAuth button in `components/ModalEmailCheck.tsx`
- ✅ API route `/api/auth/google/route.ts` created
- ✅ Callback handler `/app/auth/callback/page.tsx` exists
- ✅ Environment variables template in `.env.local`

### ⚠️ Backend (Needs Setup)
- ⏳ Google OAuth routes implementation (check if exists)
- ⏳ Environment variables on Render
- ⏳ Passport.js + Google Strategy installed

---

## 🐛 Common Issues

### "redirect_uri_mismatch"
**Fix:** Add exact redirect URI to Google Console

### "404 on /api/auth/google"
**Fix:** Backend needs Google OAuth routes implemented

### "Invalid token"
**Fix:** Check JWT_SECRET is set on backend

### Backend doesn't redirect
**Fix:** Set FRONTEND_URL environment variable on backend

---

## 📞 Need Help?

1. Check full guide: `GOOGLE_OAUTH_SETUP_GUIDE.md`
2. Verify backend has these routes:
   - GET `/api/auth/google`
   - GET `/api/auth/google/callback`
3. Check backend logs for errors
4. Test backend endpoint directly: https://rentverse-backend-emqy.onrender.com/api/auth/google

---

**Quick Summary:**
1. Get Google credentials → 2. Add to backend env vars → 3. Test login flow
