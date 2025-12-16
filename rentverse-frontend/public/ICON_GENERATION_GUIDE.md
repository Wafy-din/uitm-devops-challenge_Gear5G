# PWA Icon Generation Guide

## Current Status
Placeholder icon files have been created. For production, you need to generate proper icons.

## How to Generate Icons

### Option 1: Use Online Tool (Easiest)
1. Go to https://realfavicongenerator.net/ or https://www.pwabuilder.com/imageGenerator
2. Upload your logo (512x512 PNG recommended)
3. Download generated icons
4. Replace files in `/public` directory

### Option 2: Use CLI Tool
```bash
npm install -g pwa-asset-generator
pwa-asset-generator logo.png public/icons --icon-only --padding "0"
```

### Option 3: Manual Creation
Create PNG files with these sizes:
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

## Current Icons
Placeholder files created with RentVerse branding color (#0d9488 - Teal).

For now, we'll use the logo-nav.png as a base. In production, create dedicated app icons.

## Next Steps
1. Design proper app icon (square, simple, recognizable)
2. Generate all sizes
3. Replace placeholder icons
4. Test on device
