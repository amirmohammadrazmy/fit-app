import { Platform } from 'react-native';

// Persian Calorie AI - Modern Persian Color Palette
export default {
  // Primary colors inspired by Persian art and culture
  primary: '#6366F1', // Modern indigo
  primaryLight: '#818CF8', // Light indigo
  primaryDark: '#4F46E5', // Dark indigo
  
  // Secondary colors with Persian influence
  secondary: '#EC4899', // Persian rose
  secondaryLight: '#F472B6', // Light rose
  
  // Accent colors
  accent: '#10B981', // Emerald green
  accentLight: '#34D399', // Light emerald
  
  // Saffron inspired colors
  saffron: '#F59E0B', // Golden saffron
  saffronLight: '#FCD34D', // Light saffron
  
  // Status colors
  success: '#10B981', // Success green
  warning: '#F59E0B', // Warning amber
  danger: '#EF4444', // Danger red
  info: '#3B82F6', // Info blue
  
  // Text colors
  text: {
    primary: '#1F2937', // Dark gray
    secondary: '#6B7280', // Medium gray
    light: '#9CA3AF', // Light gray
    inverse: '#FFFFFF', // White text
    accent: '#6366F1', // Accent text
  },
  
  // Background colors
  background: {
    primary: '#FFFFFF', // Pure white
    secondary: '#F9FAFB', // Very light gray
    tertiary: '#F3F4F6', // Light gray
    card: '#FFFFFF', // Card background
    overlay: 'rgba(0, 0, 0, 0.5)', // Modal overlay
  },
  
  // Border and divider colors
  border: '#E5E7EB', // Light border
  borderLight: '#F3F4F6', // Very light border
  
  // Gradient colors
  gradient: {
    primary: ['#6366F1', '#8B5CF6'], // Primary gradient
    secondary: ['#EC4899', '#F472B6'], // Secondary gradient
    saffron: ['#F59E0B', '#FCD34D'], // Saffron gradient
  },
};

// Persian Font Configuration
export const PersianFonts = {
  regular: 'Vazirmatn-Regular',
  medium: 'Vazirmatn-Medium',
  semiBold: 'Vazirmatn-SemiBold',
  bold: 'Vazirmatn-Bold',
};

// Font utility function for cross-platform Persian font support
export const getPersianFont = (weight: 'regular' | 'medium' | 'semiBold' | 'bold' = 'regular') => {
  if (Platform.OS === 'web') {
    return 'Vazirmatn, system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
  }
  // For mobile, we'll use system fonts that support Persian
  return Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  });
};
