import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Set your live website URL before building for production.
 * Example: https://hi-tech-show-power.vercel.app
 *
 * For local dev on Android emulator use: http://10.0.2.2:3000
 * For local dev on device use your PC IP: http://192.168.x.x:3000
 */
const serverUrl = process.env.CAPACITOR_SERVER_URL ?? "https://YOUR_VERCEL_URL.vercel.app";

const config: CapacitorConfig = {
  appId: "lk.hitechshowpower.app",
  appName: "Hi Tech Show Power",
  webDir: "www",
  server: {
    url: serverUrl,
    cleartext: serverUrl.startsWith("http://"),
    androidScheme: "https",
  },
  android: {
    allowMixedContent: true,
  },
  ios: {
    contentInset: "automatic",
    scrollEnabled: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2500,
      launchAutoHide: true,
      backgroundColor: "#d32f2f",
      androidSplashResourceName: "splash",
      showSpinner: true,
      spinnerColor: "#facc15",
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#d32f2f",
    },
  },
};

export default config;
