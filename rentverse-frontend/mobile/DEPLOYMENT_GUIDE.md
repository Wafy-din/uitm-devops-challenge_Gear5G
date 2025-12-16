# RentVerse PWA + Capacitor Deployment Guide

## Overview
RentVerse is now configured as a Progressive Web App (PWA) that can be wrapped in Capacitor for native mobile apps.

## Current Setup ✅

1. **PWA Configuration**
   - ✅ next-pwa installed and configured
   - ✅ Service worker auto-generated
   - ✅ manifest.json created
   - ✅ App icons (placeholder - need proper icons)
   - ✅ Metadata for installability

2. **Capacitor Configuration**
   - ✅ Android platform added
   - ✅ Config file created
   - ✅ Ready for server mode (loading from URL)

## Next Steps

### Option A: Deploy to Vercel (Recommended for Testing)

1. **Install Vercel CLI** (if not installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   - Follow prompts
   - Choose project settings
   - Get deployment URL

4. **For production deployment**:
   ```bash
   vercel --prod
   ```

### Option B: Test Locally First

1. **Build the app**:
   ```bash
   npm run build
   npm start
   ```

2. **Test PWA**:
   - Open Chrome DevTools
   - Go to Application tab
   - Check "Service Workers" and "Manifest"
   - Test "Add to Home Screen"

3. **Test with Capacitor**:
   Update `capacitor.config.ts`:
   ```typescript
   server: {
     url: 'http://localhost:3000',
     cleartext: true,
   }
   ```

   Then:
   ```bash
   npx cap sync android
   npx cap open android
   ```

### After Deployment

1. **Update Capacitor Config**:
   Edit `capacitor.config.ts`:
   ```typescript
   server: {
     url: 'https://your-deployed-app.vercel.app',
     androidScheme: 'https',
   }
   ```

2. **Sync and Build Android**:
   ```bash
   npx cap sync android
   npx cap open android
   ```

3. **In Android Studio**:
   - Build > Generate Signed Bundle / APK
   - Create keystore (first time)
   - Generate APK or AAB

## Environment Variables for Deployment

Create `.env.production` file:
```bash
NEXT_PUBLIC_API_BASE_URL=https://rentverse-backend-emqy.onrender.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=drasefhax
```

## Testing PWA Features

### Test Install Prompt
1. Deploy to HTTPS domain
2. Open in Chrome mobile or desktop
3. Look for "Install" prompt
4. Test offline functionality

### Test Service Worker
1. Open DevTools > Application
2. Check "Service Workers" section
3. Test "Offline" mode
4. Verify caching strategies

## Mobile App Build Steps

### Debug Build (for testing)
1. Open in Android Studio
2. Build > Build Bundle(s) / APK(s) > Build APK(s)
3. Find APK in `android/app/build/outputs/apk/debug/`
4. Install on device: `adb install app-debug.apk`

### Release Build (for distribution)
1. Create keystore:
   ```bash
   keytool -genkey -v -keystore rentverse.keystore -alias rentverse -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Configure `android/app/build.gradle`:
   ```gradle
   android {
       signingConfigs {
           release {
               storeFile file('rentverse.keystore')
               storePassword 'your_password'
               keyAlias 'rentverse'
               keyPassword 'your_password'
           }
       }
       buildTypes {
           release {
               signingConfig signingConfigs.release
           }
       }
   }
   ```

3. Build release:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

4. Find APK in `android/app/build/outputs/apk/release/`

## Icon Requirements

For production, generate proper icons:
- **PWA**: 192x192, 512x512
- **Android**: 
  - mdpi: 48x48
  - hdpi: 72x72
  - xhdpi: 96x96
  - xxhdpi: 144x144
  - xxxhdpi: 192x192

Use tool: https://realfavicongenerator.net/

## Troubleshooting

### PWA not installing
- Check HTTPS (required)
- Verify manifest.json is accessible
- Check service worker registration
- Clear browser cache

### Mobile app not loading
- Check network connectivity
- Verify server URL in capacitor.config.ts
- Check CORS on backend
- Look at Android logcat for errors

### Service worker not updating
- Increment version in manifest.json
- Clear application cache
- Use "Update on reload" in DevTools

## Performance Tips

1. **Enable image optimization**:
   - Use Next.js Image component
   - Set proper sizes and quality

2. **Cache strategies**:
   - Static assets: CacheFirst
   - API calls: NetworkFirst
   - Images: CacheFirst with expiration

3. **Bundle size**:
   - Run `npm run build` and check bundle analyzer
   - Code split large dependencies
   - Lazy load routes

## Security Checklist

- [ ] HTTPS enabled
- [ ] API keys in environment variables
- [ ] Content Security Policy configured
- [ ] CORS properly configured
- [ ] Authentication tokens secure

## Ready to Deploy!

You're now ready to:
1. Deploy to Vercel
2. Test PWA features
3. Build Android APK
4. Submit to Play Store (if desired)

For questions or issues, refer to:
- Next.js PWA: https://github.com/shadowwalker/next-pwa
- Capacitor: https://capacitorjs.com/docs
