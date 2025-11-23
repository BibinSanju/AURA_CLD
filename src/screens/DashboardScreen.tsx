import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GradientBackground } from '../theme/GradientBackground';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

type DashboardScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleSettingsPress = () => {
    Alert.alert('Coming soon', 'Settings feature will be available soon!');
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>AURA Assistant</Text>
            <Text style={styles.subtitle}>{user?.email || 'user@example.com'}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Main Cards */}
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.largeCard}
            onPress={() => navigation.navigate('Chat')}
            activeOpacity={0.8}
          >
            <Text style={styles.cardIcon}>💬</Text>
            <Text style={styles.cardTitle}>Chatbot</Text>
            <Text style={styles.cardDescription}>
              Chat with AURA AI Assistant
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.largeCard}
            onPress={handleSettingsPress}
            activeOpacity={0.8}
          >
            <Text style={styles.cardIcon}>⚙️</Text>
            <Text style={styles.cardTitle}>Settings</Text>
            <Text style={styles.cardDescription}>
              Configure app preferences
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.cardOverlay,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  logoutText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    gap: 20,
  },
  largeCard: {
    backgroundColor: colors.cardOverlay,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 32,
    alignItems: 'center',
    minHeight: 180,
    justifyContent: 'center',
  },
  cardIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
