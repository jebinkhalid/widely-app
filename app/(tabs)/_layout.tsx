import { HapticTab } from "@/components/haptic-tab";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { useLanguage } from "../../context/LanguageProvider";

export default function TabLayout() {
  const context = useLanguage();

  // 🛡️ SAFETY GUARD: If the cloud isn't ready yet, don't show the tabs.
  // This prevents the "Cannot destructure lang" error.
  if (!context) {
    return null;
  }

  const { lang, t } = context;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffee00",
        tabBarInactiveTintColor: "#888",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopWidth: 0,
          // Flipped for Arabic!
          flexDirection: lang === "ar" ? "row-reverse" : "row",
          height: Platform.OS === "ios" ? 90 : 70,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("Home", "الرئيسية"),
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: t("Categories", "الأقسام"),
          tabBarIcon: ({ color }) => (
            <Ionicons name="grid-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="deals"
        options={{
          title: t("Deals", "العروض"),
          tabBarIcon: ({ color }) => (
            <Ionicons name="flash-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: t("Cart", "السلة"),
          tabBarIcon: ({ color }) => (
            <Ionicons name="cart-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: t("Account", "حسابي"),
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
