import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useFoodStore } from '@/hooks/use-food-store';
import Colors, { getPersianFont } from '@/constants/colors';
import { Crown } from 'lucide-react-native';

const DietScreen = () => {
  const router = useRouter();
  const { isPremium } = useFoodStore();

  const PremiumPlaceholder = () => (
    <View style={styles.placeholderContainer}>
      <Crown size={60} color={Colors.primary} />
      <Text style={styles.placeholderTitle}>ویژه کاربران پریمیوم</Text>
      <Text style={styles.placeholderSubtitle}>
        برای دسترسی به رژیم غذایی شخصی‌سازی شده توسط هوش مصنوعی، اشتراک خود را فعال کنید.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/premium')}
      >
        <Text style={styles.buttonText}>فعال‌سازی اشتراک</Text>
      </TouchableOpacity>
    </View>
  );

  const DietPlan = () => (
    <View style={styles.container}>
      <Text style={styles.title}>رژیم شخصی شما</Text>
      <Text style={styles.subtitle}>
        اینجا رژیم غذایی هوشمند شما نمایش داده خواهد شد. (در حال ساخت)
      </Text>
    </View>
  );

  return isPremium ? <DietPlan /> : <PremiumPlaceholder />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: getPersianFont('bold'),
    color: Colors.text.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: getPersianFont('regular'),
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    padding: 30,
  },
  placeholderTitle: {
    fontSize: 22,
    fontFamily: getPersianFont('bold'),
    color: Colors.text.primary,
    marginTop: 20,
    marginBottom: 8,
  },
  placeholderSubtitle: {
    fontSize: 16,
    fontFamily: getPersianFont('regular'),
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: getPersianFont('bold'),
  },
});

export default DietScreen;
