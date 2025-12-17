# Mobile APK Build Guide

## Configuration Update
The `capacitor.config.ts` has been updated to point to your deployed Vercel frontend:
- **URL**: `https://gear5g-rentverse-qo59lmwpe-wafis-projects-cd60a682.vercel.app`

## Building the APK
I have created a batch script `build_apk.bat` in the `rentverse-frontend` directory to automate the process.

### Steps to Build
1. **Run the Build Script**:
   Execute the `build_apk.bat` file from the terminal or by double-clicking it.
   ```cmd
   build_apk.bat
   ```
   This script performs:
   - `npx cap sync`: Updates the Android native project with the new configuration.
   - `gradlew assembleDebug`: Builds the debug APK.

2. **Locate the APK**:
   After a successful build, the APK will be located at:
   `rentverse-frontend/android/app/build/outputs/apk/debug/app-debug.apk`

3. **Install on Device**:
   Transfer this APK to your Android device and install it.

## Manual Steps (Alternative)
If you prefer to use Android Studio:
1. Run `npx cap sync` in the terminal.
2. Run `npx cap open android`.
3. In Android Studio, wait for Gradle sync to finish.
4. Click the **Run** button (green play icon) or **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

## Troubleshooting
- **Gradle Errors**: Ensure you have JDK 17 installed and `JAVA_HOME` set.
- **SDK Errors**: Ensure Android SDK is installed and the path is set in `local.properties` (automatically handled by Android Studio usually).
