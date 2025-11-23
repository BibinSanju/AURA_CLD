# Building AURA Mobile APK with Voice Recognition

This guide will help you build an Android APK with full voice recognition support.

## Prerequisites

1. **Expo Account**: Sign up at https://expo.dev
2. **EAS CLI**: Already installed globally
3. **Android SDK**: Not required for EAS Cloud builds

## Option 1: Build APK with EAS Cloud (Recommended)

### Step 1: Login to Expo
```bash
eas login
```

### Step 2: Configure the project
```bash
eas build:configure
```

### Step 3: Build Android APK
```bash
# For preview/testing build
eas build --platform android --profile preview

# For production build
eas build --platform android --profile production
```

### Step 4: Download APK
After the build completes (takes 10-20 minutes), you'll get a download link.
Download the APK and install it on your Android device.

## Option 2: Build Locally (Requires Android SDK)

### Step 1: Prebuild native code
```bash
npx expo prebuild --platform android
```

### Step 2: Build APK
```bash
cd android
./gradlew assembleRelease
```

The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

## Testing Voice Commands

Once installed, test these voice commands:
- "Open YouTube"
- "Play cats on YouTube"
- "Turn on flashlight"
- "Turn off flashlight"
- "Send WhatsApp to +1234567890: Hello"

## Voice Recognition Features

- **Real-time speech recognition** using Android's native speech API
- **Visual feedback** with "Listening..." indicator
- **Microphone permission** automatically requested
- **Error handling** with user-friendly messages
- **Works offline** for local commands
- **Auto-fill** text input with recognized speech

## Backend Setup

Don't forget to configure your backend API:

1. Edit `.env` file:
   ```
   EXPO_PUBLIC_API_BASE_URL=http://your-server-ip:3000
   ```

2. For Android emulator, use:
   ```
   EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:3000
   ```

3. For physical device, use your computer's local IP:
   ```
   EXPO_PUBLIC_API_BASE_URL=http://192.168.1.x:3000
   ```

## Troubleshooting

### Voice recognition not working
- Ensure microphone permission is granted
- Check that Google services are installed on device
- Test with a simple "Hello" command

### APK install fails
- Enable "Install from unknown sources" in Android settings
- Make sure you're using Android 6.0 or higher

### Backend connection fails
- Verify backend is running
- Check IP address is correct
- Ensure firewall allows connections
- Test with a REST client first

## Build Profiles

- **development**: For testing with Expo Go alternative
- **preview**: For internal testing (APK)
- **production**: For release (APK or AAB for Play Store)

## Next Steps

After building:
1. Install APK on Android device
2. Grant camera and microphone permissions
3. Configure backend URL if needed
4. Test voice commands and device actions
5. Share APK for testing or submit to Play Store

## Support

For issues:
- Check Expo docs: https://docs.expo.dev
- EAS Build: https://docs.expo.dev/build/introduction/
- Voice library: https://github.com/react-native-voice/voice
