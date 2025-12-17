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

3. **Transfer and Install**:
   Once you have the `app-debug.apk` file, you need to get it onto your phone.

   **Method A: USB Transfer (Recommended)**
   1. Connect your Android phone to your PC via USB.
   2. On your phone, change the USB mode from "Charging only" to "File Transfer".
   3. Copy the `app-debug.apk` file from your PC to your phone's "Downloads" folder.
   4. On your phone, open your *File Manager* app.
   5. Navigate to Downloads and tap `app-debug.apk`.
   6. If prompted, allow "Install from Unknown Sources" (this is normal for debug apps).
   7. Tap **Install**.

   **Method B: WhatsApp / Messaging**
   1. Open WhatsApp Web on your PC.
   2. Send the `app-debug.apk` file to yourself or a friend.
   3. On your phone, open WhatsApp and tap the file to download and install.

   **Method C: Google Drive**
   1. Upload the `app-debug.apk` to your Google Drive.
   2. Open the Drive app on your phone.
   3. Tap the file and select "Install" or "Package Installer".

   **Note**: Since it is a debug build signed with a test key, Play Protect might warn you. You can tap "Install Anyway".

## Manual Steps (Alternative)
If you prefer to use Android Studio:
1. Run `npx cap sync` in the terminal.
2. Run `npx cap open android`.
3. In Android Studio, wait for Gradle sync to finish.
4. Click the **Run** button (green play icon) or **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

## Troubleshooting
- **Gradle Errors**: Ensure you have JDK 17 installed and `JAVA_HOME` set.
- **SDK Errors**: Ensure Android SDK is installed and the path is set in `local.properties` (automatically handled by Android Studio usually).
