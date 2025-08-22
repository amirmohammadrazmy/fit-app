import React from "react";
import { Tabs } from "expo-router";
import { Home, ScanLine, Clock, User } from "lucide-react-native";
import Colors, { getPersianFont } from "@/constants/colors";
import { I18nManager } from 'react-native';

// Enable RTL for Persian text
I18nManager.allowRTL(true);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.text.light,
        tabBarStyle: {
          backgroundColor: Colors.background.primary,
          borderTopColor: Colors.borderLight,
          borderTopWidth: 1,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: 85,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
          fontFamily: getPersianFont('medium'),
        },
        headerStyle: {
          backgroundColor: Colors.background.primary,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: Colors.borderLight,
        },
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
          color: Colors.text.primary,
          fontFamily: getPersianFont('bold'),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "خانه",
          tabBarIcon: ({ color, focused }) => (
            <Home 
              size={24} 
              color={color} 
              fill={focused ? color : 'transparent'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "اسکن",
          tabBarIcon: ({ color, focused }) => (
            <ScanLine 
              size={24} 
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "تاریخچه",
          tabBarIcon: ({ color, focused }) => (
            <Clock 
              size={24} 
              color={color}
              fill={focused ? color : 'transparent'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "پروفایل",
          tabBarIcon: ({ color, focused }) => (
            <User 
              size={24} 
              color={color}
              fill={focused ? color : 'transparent'}
            />
          ),
        }}
      />
    </Tabs>
  );
}
