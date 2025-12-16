import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rentverse.app',
  appName: 'RentVerse',
  webDir: 'public', // Placeholder, not used in server mode
  server: {
    // For development: use localhost
    // url: 'http://localhost:3000',
    // cleartext: true,
    url: 'https://rentverse-frontend-8g9kji5u8-wafis-projects-cd60a682.vercel.app',  // Paste URL di sini
    // For production: use deployed URL
    // Uncomment after deploying to Vercel
    // url: 'https://your-app.vercel.app',
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
