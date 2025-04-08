
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c892c6890dd640ada5c591e03b7cd24f',
  appName: 'EduPercentage',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: 'https://c892c689-0dd6-40ad-a5c5-91e03b7cd24f.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  // Ρυθμίσεις για καλύτερη εμπειρία σε κινητές συσκευές
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#4f46e5",
      showSpinner: true,
      spinnerColor: "#ffffff",
      androidSpinnerStyle: "large"
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#4f46e5"
    }
  }
};

export default config;
