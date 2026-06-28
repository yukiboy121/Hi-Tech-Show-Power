@echo off
echo Hi Tech Show Power - Mobile App Setup
echo.

cd /d "%~dp0.."

echo [1/3] Generating app icons...
call npm run mobile:icons 2>nul

echo [2/3] Installing Capacitor dependencies...
cd mobile
call npm install
if errorlevel 1 exit /b 1

echo [3/3] Adding Android and iOS platforms...
if not exist android call npx cap add android
if not exist ios call npx cap add ios
call npx cap sync

echo.
echo Done! Next steps:
echo   1. Edit mobile/capacitor.config.ts - set your Vercel URL
echo   2. Android: npm run mobile:android
echo   3. iOS (Mac): npm run mobile:ios
echo.
echo See MOBILE_APP.md for full guide.
