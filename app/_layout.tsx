import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import Colors, { getPersianFont } from "@/constants/colors";

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
      </Stack>
    </>
  );
}
