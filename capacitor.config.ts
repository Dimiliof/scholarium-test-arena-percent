
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.edupercentage',
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
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  },
  android: {
    flavor: "production",
    buildOptions: {
      keystorePath: "edupercentage.keystore",
      keystorePassword: "edupercentage",
      keystoreAlias: "edupercentage",
      keystoreAliasPassword: "edupercentage",
      releaseType: "AAB"
    }
  },
  ios: {
    contentInset: "always",
    scheme: "EduPercentage",
    limitsNavigationsToAppBoundDomains: true,
    backgroundColor: "#ffffff"
  }
};

export default config;
