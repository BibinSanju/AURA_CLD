# AURA Mobile - AI Assistant React Native App

An Expo React Native application with TypeScript featuring an Aura-themed UI (dark background with purple-pink gradients) and AI assistant capabilities.

## Features

- **Authentication**: Email/password login with validation
- **Dashboard**: Quick access to Chatbot and Settings
- **Chat Interface**: 
  - Talk to AURA AI Assistant
  - Markdown support for code blocks
  - Message history with timestamps
  - Online/offline status indicator
- **Device Actions**:
  - Open YouTube (with or without search query)
  - Open WhatsApp (with optional phone number and message)
  - Flashlight control (on/off)
- **Voice Input**: Basic voice input support (placeholder implementation)
- **Client-side Commands**: Quick local command parsing for instant actions

## Tech Stack

- **Framework**: Expo SDK ~54
- **Language**: TypeScript
- **UI**: React Native with Expo Linear Gradient
- **Navigation**: React Navigation (Native Stack)
- **Markdown**: react-native-markdown-display
- **Icons**: @expo/vector-icons (Ionicons)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
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

## Running the App

### Development Mode

Start the Expo development server:
```bash
npm start
```

### Android

```bash
npm run android
```

### iOS (macOS only)

```bash
npm run ios
```

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
│   └── ChatScreen.tsx          # Chat interface
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
- `RECORD_AUDIO` - For voice input (future implementation)

## Known Limitations

1. **Flashlight**: The current flashlight implementation is a placeholder. Full torch control requires native implementation or a dedicated flashlight package.

2. **Voice Input**: Basic placeholder implementation. Full speech-to-text requires additional setup and permissions.

3. **Network**: Ensure your backend API is accessible from the device/emulator.

## Troubleshooting

### Cannot connect to backend
- Make sure the backend is running
- Update `EXPO_PUBLIC_API_BASE_URL` in `.env`
- For Android emulator, use `http://10.0.2.2:3000` instead of `localhost:3000`

### Flashlight not working
- Ensure camera permissions are granted
- Flashlight requires native implementation for production use

### Navigation issues
- Clear Expo cache: `npx expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## License

MIT

## Contributing

Pull requests are welcome! Please ensure all changes follow the existing code style and structure.
