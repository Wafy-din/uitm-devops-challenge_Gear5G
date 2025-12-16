# Vercel Deployment Instructions

## Issues Found & Fixed ✅

### Issue 1: Missing next-pwa
Build failed because `next-pwa` was not in `package.json` dependencies.

**Fixed**: Added to package.json:
- `next-pwa: ^5.6.0`
- `@capacitor/core: ^6.2.0`
- `@capacitor/cli: ^6.2.0`
- `@capacitor/android: ^6.2.0`

### Issue 2: Missing recharts
Build failed with error:
```
Module not found: Can't resolve 'recharts'
```

**Fixed**: Added to package.json:
- `recharts: ^2.12.7`

### Verified
✅ Local build successful: `Compiled successfully in 969ms`

## Deploy Now

```bash
vercel --prod
```

**This should work now!** All dependencies are properly listed.

### 2. After Successful Deployment

You'll get a URL like:
```
https://rentverse-frontend-xxxxx.vercel.app
```

### 3. Update Capacitor Config

Edit `capacitor.config.ts`:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rentverse.app',
  appName: 'RentVerse',
  webDir: 'public',
  server: {
    url: 'https://your-vercel-url.vercel.app',  // PUT YOUR URL HERE
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0d9488',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0d9488',
    },
  },
};

export default config;
```

### 4. Sync and Build Android

```bash
# Sync with new URL
npx cap sync android

# Open Android Studio
npx cap open android
```

### 5. In Android Studio

1. Wait for Gradle sync to finish
2. Go to: **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**
3. Wait for build to complete
4. APK will be in: `android/app/build/outputs/apk/debug/app-debug.apk`

### 6. Test APK

Install on device:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

Or share APK file directly to test on other devices.

## Troubleshooting

### Build still fails on Vercel
- Check build logs on Vercel dashboard
- Make sure all env vars are set (if needed)
- Try: `vercel --debug`

### Android build fails
- Make sure Android Studio SDK is installed
- Check Java version: `java -version` (need JDK 17)
- Run: `npx cap sync android` again
- Clean build: Delete `android/.gradle` and rebuild

### App shows blank screen
- Check network connectivity
- Verify URL in capacitor.config.ts
- Check browser console in app (Chrome inspect)
- Look at Android logcat: `adb logcat | findstr WebView`

## Environment Variables

If your app needs env vars on Vercel:

1. Go to Vercel dashboard
2. Project Settings > Environment Variables
3. Add:
   - `NEXT_PUBLIC_API_BASE_URL=https://rentverse-backend-emqy.onrender.com`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=drasefhax`

4. Redeploy: `vercel --prod`

## Success Checklist

- [ ] `vercel --prod` completes successfully
- [ ] Web app loads at Vercel URL
- [ ] Updated `capacitor.config.ts` with URL
- [ ] Ran `npx cap sync android`
- [ ] Built APK in Android Studio
- [ ] Installed and tested APK on device
- [ ] App loads content from Vercel

---

**Current Status**: Ready to redeploy with fixed package.json

**Next Command**: `vercel --prod`
