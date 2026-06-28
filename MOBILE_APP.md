# Hi Tech Show Power — Mobile App (iOS & Android)

මේ project එකේ **දෙවර්ගයේ** mobile app support තියෙනවා:

1. **PWA** — Browser එකෙන් "Add to Home Screen" / "Install App"
2. **Capacitor** — App Store & Google Play එකට දාන්න පුළුවන් native app

---

## Option 1: PWA (වේගවත්)

Website deploy කළාට පස්සේ:

**Android:** Chrome → Menu → Install app  
**iPhone:** Safari → Share → Add to Home Screen

Icons generate:
```bash
npm install
npm run mobile:icons
```

---

## Option 2: Capacitor (App Store / Play Store)

### අවශ්‍ය tools
- **Android:** Android Studio, JDK 17+
- **iOS:** Mac, Xcode, Apple Developer account

### Setup

1. `mobile/capacitor.config.ts` එකේ Vercel URL set කරන්න:
   ```ts
   const serverUrl = "https://your-app.vercel.app";
   ```

2. Run setup:
   ```bash
   npm install
   npm run mobile:icons
   cd mobile && npm install
   npx cap add android
   npx cap add ios
   npx cap sync
   ```

3. **Android:** `npm run mobile:android` → Android Studio → Run  
4. **iOS (Mac):** `npm run mobile:ios` → Xcode → Run

### Local test on phone
```bash
npm run dev
# Set: CAPACITOR_SERVER_URL=http://YOUR_PC_IP:3000
cd mobile && npx cap sync && npx cap run android
```

---

## App info

| Field | Value |
|-------|--------|
| App ID | `lk.hitechshowpower.app` |
| Name | Hi Tech Show Power |
| Theme | #d32f2f |

App එක live website load කරනවා — web update කළාම app එකත් update වෙනවා.
