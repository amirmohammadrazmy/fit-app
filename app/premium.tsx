import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Crown } from 'lucide-react-native';
import Colors, { getPersianFont } from '@/constants/colors';
import bazaar from '@cafebazaar/react-native-poolakey';
import { useFoodStore } from '@/hooks/use-food-store';

const PremiumScreen = () => {
  const router = useRouter();
  const { setIsPremium } = useFoodStore();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubscription = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with your actual Subscription SKU from Cafe Bazaar
      const SUBSCRIPTION_SKU = "monthly_subscription_sku";

      console.log(`Attempting to subscribe to product: ${SUBSCRIPTION_SKU}`);
      const purchase = await bazaar.subscribeProduct(SUBSCRIPTION_SKU);
      console.log('Purchase successful:', purchase);

      // Optionally, you can verify the purchase with your backend here

      setIsPremium(true);
      Alert.alert('تبریک!', 'اشتراک شما با موفقیت فعال شد.');
      router.back();

    } catch (error) {
      console.error('Subscription error:', error);
      Alert.alert('خطا', 'متاسفانه در فرآیند خرید مشکلی پیش آمد. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Crown size={80} color={Colors.primary} style={styles.icon} />
      <Text style={styles.title}>کاربر ویژه شوید</Text>
      <Text style={styles.subtitle}>
        با فعال‌سازی اشتراک ماهانه (۹۰,۰۰۰ تومان)، به قابلیت‌های زیر دسترسی پیدا کنید:
      </Text>
      <View style={styles.features}>
        <Text style={styles.featureText}>✓ اسکن نامحدود غذا</Text>
        <Text style={styles.featureText}>✓ دریافت رژیم غذایی شخصی با هوش مصنوعی</Text>
        <Text style={styles.featureText}>✓ تحلیل و آنالیز پیشرفته</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubscription} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>فعال‌سازی اشتراک ماهانه</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.cancelText}>انصراف</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: getPersianFont('bold'),
    color: Colors.text.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: getPersianFont('regular'),
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  features: {
    alignSelf: 'flex-start',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  featureText: {
    fontSize: 18,
    fontFamily: getPersianFont('medium'),
    color: Colors.text.primary,
    marginBottom: 15,
    textAlign: 'right',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: getPersianFont('bold'),
  },
  cancelText: {
    fontSize: 16,
    fontFamily: getPersianFont('medium'),
    color: Colors.text.light,
  },
});

export default PremiumScreen;
