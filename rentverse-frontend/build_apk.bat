@echo off
echo Syncing Capacitor config...
call npx cap sync
if %ERRORLEVEL% NEQ 0 (
    echo Capacitor sync failed!
    exit /b %ERRORLEVEL%
)

echo Building Android APK...
cd android
call gradlew assembleDebug
if %ERRORLEVEL% NEQ 0 (
    echo Gradle build failed!
    exit /b %ERRORLEVEL%
)

echo Build Complete!
echo APK should be at android\app\build\outputs\apk\debug\app-debug.apk
pause
