import { Alert, Linking } from 'react-native';
import { Camera } from 'expo-camera';

export type DeviceIntent =
  | { action: 'open_app'; target: 'youtube'; query?: string }
  | { action: 'open_app'; target: 'whatsapp'; phone?: string; text?: string }
  | { action: 'flashlight_on' }
  | { action: 'flashlight_off' };

// Track flashlight state
let flashlightEnabled = false;

/**
 * Open YouTube app or web
 */
async function openYouTube(query?: string): Promise<void> {
  try {
    let url: string;
    
    if (query) {
      const encodedQuery = encodeURIComponent(query);
      url = 'https://www.youtube.com/results?search_query=' + encodedQuery;
    } else {
      url = 'https://www.youtube.com/';
    }

    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Unable to open YouTube');
    }
  } catch (error) {
    console.error('Error opening YouTube:', error);
    Alert.alert('Error', 'Failed to open YouTube');
  }
}

/**
 * Open WhatsApp with optional phone and text
 */
async function openWhatsApp(phone?: string, text?: string): Promise<void> {
  try {
    // Try WhatsApp URL scheme first
    const encodedText = encodeURIComponent(text || '');
    const phoneParam = phone ? '&phone=' + encodeURIComponent(phone) : '';
    const whatsappUrl = 'whatsapp://send?text=' + encodedText + phoneParam;
    
    const canOpenScheme = await Linking.canOpenURL(whatsappUrl);
    
    if (canOpenScheme) {
      await Linking.openURL(whatsappUrl);
      return;
    }

    // Fallback to web WhatsApp
    const webUrl = 'https://wa.me/' + (phone || '') + '?text=' + encodedText;
    const canOpenWeb = await Linking.canOpenURL(webUrl);
    
    if (canOpenWeb) {
      await Linking.openURL(webUrl);
    } else {
      Alert.alert('Error', 'WhatsApp is not installed or cannot be opened');
    }
  } catch (error) {
    console.error('Error opening WhatsApp:', error);
    Alert.alert('Error', 'Failed to open WhatsApp');
  }
}

/**
 * Turn flashlight on
 */
async function turnFlashlightOn(): Promise<void> {
  try {
    // Request camera permission
    const { status } = await Camera.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permission is required to use the flashlight');
      return;
    }

    // Note: Expo Camera doesn't have direct torch control in the newer versions
    // For production, you would need to use a native module or different approach
    // This is a placeholder implementation
    flashlightEnabled = true;
    console.log('Flashlight turned on');
    Alert.alert('Flashlight', 'Flashlight turned on (Note: Actual torch control requires native implementation)');
  } catch (error) {
    console.error('Error turning on flashlight:', error);
    Alert.alert('Error', 'Your device may not support flashlight control or an error occurred');
  }
}

/**
 * Turn flashlight off
 */
async function turnFlashlightOff(): Promise<void> {
  try {
    flashlightEnabled = false;
    console.log('Flashlight turned off');
    Alert.alert('Flashlight', 'Flashlight turned off');
  } catch (error) {
    console.error('Error turning off flashlight:', error);
    Alert.alert('Error', 'Failed to turn off flashlight');
  }
}

/**
 * Main handler for device intents
 */
export async function handleDeviceIntent(intent: DeviceIntent): Promise<void> {
  switch (intent.action) {
    case 'open_app':
      if (intent.target === 'youtube') {
        await openYouTube(intent.query);
      } else if (intent.target === 'whatsapp') {
        await openWhatsApp(intent.phone, intent.text);
      }
      break;
    
    case 'flashlight_on':
      await turnFlashlightOn();
      break;
    
    case 'flashlight_off':
      await turnFlashlightOff();
      break;
    
    default:
      console.warn('Unknown device intent:', intent);
  }
}
