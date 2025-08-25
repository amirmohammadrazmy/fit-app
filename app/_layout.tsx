import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import Colors, { getPersianFont } from "@/constants/colors";
import bazaar from "@cafebazaar/react-native-poolakey";
import { useFoodStore } from "@/hooks/use-food-store";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Load Persian fonts for web
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Load Vazirmatn font from Google Fonts for web
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;200;300;400;500;600;700;800;900&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, []);

  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const setIsPremium = useFoodStore((state) => state.setIsPremium);

  useEffect(() => {
    // TODO: Replace with your actual RSA public key from Cafe Bazaar's developer panel
    const rsaKey = "YOUR_BAZAAR_RSA_PUBLIC_KEY";
    // TODO: Replace with your actual Subscription SKU from Cafe Bazaar
    const SUBSCRIPTION_SKU = "monthly_subscription_sku";

    const checkSubscriptionStatus = async () => {
      try {
        console.log("Connecting to Bazaar to check subscription...");
        await bazaar.connect(rsaKey);
        console.log("✅ Connection successful. Checking for subscriptions...");

        const purchases = await bazaar.getSubscribedProducts();
        console.log("Active subscriptions:", purchases);

        const hasSubscription = purchases.some(
          (purchase) => purchase.productId === SUBSCRIPTION_SKU
        );

        setIsPremium(hasSubscription);
        console.log(`User is ${hasSubscription ? 'PREMIUM' : 'not premium'}`);

      } catch (e) {
        console.error("❌ Error checking subscription status:", e);
        // Assume not premium if there's an error
        setIsPremium(false);
      }
    };

    checkSubscriptionStatus();

    return () => {
      console.log("Disconnecting from Bazaar...");
      bazaar.disconnect();
    };
  }, [setIsPremium]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.background.primary,
          },
          headerTintColor: Colors.primary,
          headerTitleStyle: {
            fontWeight: '600',
            fontFamily: getPersianFont('semiBold'),
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="food-details/[id]" 
          options={{ 
            title: "جزئیات غذا",
            presentation: "card",
          }} 
        />
        <Stack.Screen 
          name="camera" 
          options={{ 
            title: "اسکن غذا",
            presentation: "modal",
            headerShown: false,
          }} 
        />
        <Stack.Screen
          name="premium"
          options={{
            title: "عضویت ویژه",
            presentation: "modal",
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
