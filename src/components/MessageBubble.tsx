import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface MessageBubbleProps {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ text, isUser, timestamp }) => {
  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        <Text style={styles.text}>{text}</Text>
        <Text style={styles.timestamp}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  aiContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: colors.cardOverlay,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderBottomLeftRadius: 4,
  },
  text: {
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 4,
    textAlign: 'right',
  },
});
