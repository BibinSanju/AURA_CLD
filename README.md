# AURA Mobile - AI Assistant React Native App

An Expo React Native application with TypeScript featuring an Aura-themed UI (dark background with purple-pink gradients) and AI assistant capabilities with **full voice recognition support**.

## Features

- **Authentication**: Email/password login with validation
- **Dashboard**: Quick access to Chatbot and Settings
- **Chat Interface**: 
  - Talk to AURA AI Assistant
  - **Full Voice Recognition** with real-time speech-to-text
  - Markdown support for code blocks
  - Message history with timestamps
  - Online/offline status indicator
  - Visual "Listening..." feedback
- **Device Actions**:
  - Open YouTube (with or without search query)
  - Open WhatsApp (with optional phone number and message)
  - Flashlight control (on/off)
- **Voice Commands**: Speak naturally to control the app
- **Client-side Commands**: Quick local command parsing for instant actions

## Tech Stack

- **Framework**: Expo SDK ~54
- **Language**: TypeScript
- **UI**: React Native with Expo Linear Gradient
- **Navigation**: React Navigation (Native Stack)
- **Voice Recognition**: @react-native-voice/voice
- **Markdown**: react-native-markdown-display
- **Icons**: @expo/vector-icons (Ionicons)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo account (for building APK)
- EAS CLI (already installed)
- Physical Android device or emulator

## Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd aura-mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment configuration:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update the API base URL:
   ```
   EXPO_PUBLIC_API_BASE_URL=http://your-backend-url:3000
   ```

## Building Android APK

### Quick Start (EAS Cloud Build - Recommended)

```bash
# Login to Expo
eas login

# Build APK
eas build --platform android --profile preview

# Download and install the APK on your device
```

See [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md) for detailed build instructions.

## Running the App (Development)

### Development Mode

Start the Expo development server:
```bash
npm start
```

**Note**: Voice recognition requires a native build (APK). It won't work in Expo Go.

### Android

```bash
npm run android
```

## Voice Commands

The app supports full voice recognition. Press and hold the microphone button, then speak:

### Voice Command Examples:
- **"Open YouTube"** - Opens YouTube app
- **"Play cats on YouTube"** - Searches YouTube for "cats"
- **"Turn on flashlight"** - Activates flashlight
- **"Turn off flashlight"** - Deactivates flashlight
- **"Send WhatsApp to +1234567890: Hello there"** - Opens WhatsApp with message

### How Voice Works:
1. Tap the microphone icon
2. Speak your command
3. Watch the "Listening..." indicator
4. The recognized text appears in the input field
5. Send or edit before sending

## Project Structure

```
src/
├── components/
│   └── MessageBubble.tsx       # Chat message component with Markdown
├── context/
│   └── AuthContext.tsx         # Authentication state management
├── navigation/
│   └── RootNavigator.tsx       # Navigation configuration
├── screens/
│   ├── LoginScreen.tsx         # Login with validation
│   ├── DashboardScreen.tsx     # Main dashboard
│   └── ChatScreen.tsx          # Chat interface with voice recognition
├── services/
│   ├── api.ts                  # API client for backend
│   └── deviceActions.ts        # Device control functions
└── theme/
    ├── colors.ts               # Aura theme colors
    └── GradientBackground.tsx  # Gradient background component
```

## Quick Commands

The app supports quick local commands that are processed instantly without calling the backend:

- **YouTube**: 
  - `open youtube` - Opens YouTube app
  - `play <query> on youtube` - Searches YouTube for query
  
- **WhatsApp**:
  - `send whatsapp to <phone>: <message>` - Opens WhatsApp with message
  
- **Flashlight**:
  - `turn on flashlight` or `flashlight on`
  - `turn off flashlight` or `flashlight off`

## Backend API

The app expects a backend API endpoint at `/chat` that accepts:

**Request:**
```json
{
  "user_id": "user@example.com",
  "message": "Hello"
}
```

**Response:**
```json
{
  "reply": "Hi there!",
  "type": "chat|code|device",
  "intent": {
    "action": "open_app",
    "target": "youtube",
    "query": "optional"
  }
}
```

### Response Types

- `chat`: Regular chat response
- `code`: Code-related response (with markdown code blocks)
- `device`: Device action response (triggers device intent)

## Device Intents

When the backend returns `type: "device"`, the app handles the following intents:

```typescript
type DeviceIntent =
  | { action: 'open_app'; target: 'youtube'; query?: string }
  | { action: 'open_app'; target: 'whatsapp'; phone?: string; text?: string }
  | { action: 'flashlight_on' }
  | { action: 'flashlight_off' };
```

## Permissions

The app requires the following Android permissions:
- `CAMERA` - For flashlight control
- `RECORD_AUDIO` - For voice recognition

These are automatically requested when needed.

## Known Limitations

1. **Flashlight**: The current flashlight implementation is a placeholder. Full torch control requires native implementation or a dedicated flashlight package.

2. **Voice Recognition**: 
   - Requires native build (APK) - won't work in Expo Go
   - Requires Google services on Android device
   - Requires internet connection for speech recognition
   - Language is set to English (en-US)

3. **Network**: Ensure your backend API is accessible from the device/emulator.

## Troubleshooting

### Cannot connect to backend
- Make sure the backend is running
- Update `EXPO_PUBLIC_API_BASE_URL` in `.env`
- For Android emulator, use `http://10.0.2.2:3000` instead of `localhost:3000`
- For physical device, use your computer's local IP

### Voice recognition not working
- Build and install the APK (doesn't work in Expo Go)
- Ensure microphone permission is granted
- Check that Google services are installed on device
- Test with a simple command like "Hello"

### Flashlight not working
- Ensure camera permissions are granted
- Flashlight requires native implementation for production use

### Build issues
- Clear Expo cache: `npx expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check EAS build status: `eas build:list`

## License

MIT

## Contributing

Pull requests are welcome! Please ensure all changes follow the existing code style and structure.

## Support

For detailed build instructions, see [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md)

For issues:
- Expo docs: https://docs.expo.dev
- EAS Build: https://docs.expo.dev/build/introduction/
- Voice library: https://github.com/react-native-voice/voice
