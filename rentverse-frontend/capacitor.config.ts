import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rentverse.app',
  appName: 'RentVerse',
  webDir: 'public', // Placeholder, not used in server mode
  server: {
    // For development: use localhost
    // url: 'http://localhost:3000',
    // cleartext: true,
    url: 'https://gear5g-rentverse.vercel.app',
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
