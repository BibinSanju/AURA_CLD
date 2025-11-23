import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Voice from '@react-native-voice/voice';
import { GradientBackground } from '../theme/GradientBackground';
import { colors } from '../theme/colors';
import { MessageBubble } from '../components/MessageBubble';
import { sendChatMessage } from '../services/api';
import { handleDeviceIntent, DeviceIntent } from '../services/deviceActions';
import { useAuth } from '../context/AuthContext';

type ChatScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
};

export const ChatScreen: React.FC<ChatScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Initialize Voice recognition
  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Voice event handlers
  const onSpeechStart = () => {
    setIsListening(true);
  };

  const onSpeechEnd = () => {
    setIsListening(false);
  };

  const onSpeechResults = (e: any) => {
    if (e.value && e.value[0]) {
      setInputText(e.value[0]);
    }
    setIsListening(false);
  };

  const onSpeechError = (e: any) => {
    console.error('Speech recognition error:', e);
    setIsListening(false);
    Alert.alert('Voice Error', 'Failed to recognize speech. Please try again.');
  };

  /**
   * Request microphone permission for Android
   */
  const requestMicrophonePermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'AURA needs access to your microphone for voice input',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  /**
   * Handle voice input
   */
  const handleVoiceInput = async () => {
    if (isListening) {
      // Stop listening
      try {
        await Voice.stop();
        setIsListening(false);
      } catch (error) {
        console.error('Error stopping voice:', error);
      }
      return;
    }

    // Request permission
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Microphone permission is required for voice input');
      return;
    }

    // Start listening
    try {
      await Voice.start('en-US');
      setIsListening(true);
    } catch (error) {
      console.error('Error starting voice:', error);
      Alert.alert('Voice Error', 'Failed to start voice recognition. Please try again.');
    }
  };

  /**
   * Client-side command parser for quick local commands
   */
  const maybeHandleLocalCommand = (text: string): boolean => {
    const lowerText = text.toLowerCase().trim();

    // YouTube patterns
    if (lowerText === 'open youtube') {
      const intent: DeviceIntent = { action: 'open_app', target: 'youtube' };
      handleDeviceIntent(intent);
      addAssistantMessage('Okay, opening YouTube.');
      return true;
    }

    const youtubeMatch = lowerText.match(/^play (.+) on youtube$/);
    if (youtubeMatch) {
      const query = youtubeMatch[1];
      const intent: DeviceIntent = { action: 'open_app', target: 'youtube', query };
      handleDeviceIntent(intent);
      addAssistantMessage('Okay, opening YouTube for: ' + query);
      return true;
    }

    // WhatsApp patterns
    const whatsappMatch = lowerText.match(/^send whatsapp to (.+?): (.+)$/);
    if (whatsappMatch) {
      const phone = whatsappMatch[1];
      const text = whatsappMatch[2];
      const intent: DeviceIntent = { action: 'open_app', target: 'whatsapp', phone, text };
      handleDeviceIntent(intent);
      addAssistantMessage('Okay, opening WhatsApp to send: ' + text);
      return true;
    }

    // Flashlight patterns
    if (lowerText === 'turn on flashlight' || lowerText === 'flashlight on') {
      const intent: DeviceIntent = { action: 'flashlight_on' };
      handleDeviceIntent(intent);
      addAssistantMessage('Turning on the flashlight.');
      return true;
    }

    if (lowerText === 'turn off flashlight' || lowerText === 'flashlight off') {
      const intent: DeviceIntent = { action: 'flashlight_off' };
      handleDeviceIntent(intent);
      addAssistantMessage('Turning off the flashlight.');
      return true;
    }

    return false;
  };

  /**
   * Add an assistant message
   */
  const addAssistantMessage = (content: string) => {
    const assistantMessage: Message = {
      id: Date.now().toString() + '-assistant',
      role: 'assistant',
      content,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, assistantMessage]);
  };

  /**
   * Handle sending a message
   */
  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessageText = inputText.trim();
    setInputText('');

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessageText,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Check for local commands first
    if (maybeHandleLocalCommand(userMessageText)) {
      return;
    }

    // Send to backend API
    try {
      setIsLoading(true);

      // Add temporary "Thinking..." message
      const thinkingId = Date.now().toString() + '-thinking';
      const thinkingMessage: Message = {
        id: thinkingId,
        role: 'assistant',
        content: 'Thinking...',
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, thinkingMessage]);

      // Call API
      const response = await sendChatMessage(user?.email || 'unknown', userMessageText);

      // Remove thinking message and add real response
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== thinkingId);
        const assistantMessage: Message = {
          id: Date.now().toString() + '-assistant',
          role: 'assistant',
          content: response.reply,
          createdAt: Date.now(),
        };
        return [...filtered, assistantMessage];
      });

      // Handle device intents if present
      if (response.type === 'device' && response.intent) {
        handleDeviceIntent(response.intent);
      }
    } catch (error) {
      // Remove thinking message
      setMessages((prev) => prev.filter((msg) => !msg.content.includes('Thinking...')));

      // Show error message
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to send message. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>AURA Assistant</Text>
            <View style={styles.statusContainer}>
              <View style={styles.onlineDot} />
              <Text style={styles.statusText}>Online</Text>
            </View>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble content={item.content} role={item.role} timestamp={item.createdAt} />
          )}
          contentContainerStyle={styles.messageList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Start a conversation with AURA</Text>
              <Text style={styles.emptySubtext}>Try: "Open YouTube" or "Turn on flashlight"</Text>
              <Text style={styles.emptySubtext}>Tap the mic icon to use voice commands</Text>
            </View>
          }
        />

        {/* Listening Indicator */}
        {isListening && (
          <View style={styles.listeningIndicator}>
            <View style={styles.listeningDot} />
            <Text style={styles.listeningText}>Listening...</Text>
          </View>
        )}

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
            onPress={handleVoiceInput}
            disabled={isLoading}
          >
            <Ionicons
              name={isListening ? 'mic' : 'mic-outline'}
              size={24}
              color={isListening ? colors.error : colors.textSecondary}
            />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={!isLoading}
          />

          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.textPrimary} />
            ) : (
              <Ionicons name="send" size={20} color={colors.textPrimary} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  messageList: {
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
  listeningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: colors.cardOverlay,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  listeningDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.error,
    marginRight: 8,
  },
  listeningText: {
    fontSize: 14,
    color: colors.error,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.cardOverlay,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    alignItems: 'flex-end',
  },
  voiceButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceButtonActive: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: 20,
  },
  input: {
    flex: 1,
    backgroundColor: colors.darkCard,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.textPrimary,
    maxHeight: 100,
    marginHorizontal: 8,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
