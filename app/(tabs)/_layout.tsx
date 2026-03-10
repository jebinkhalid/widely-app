import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
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
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: t("Categories", "الأقسام"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="square.grid.2x2.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="deals"
        options={{
          title: t("Deals", "العروض"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="bolt.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: t("Cart", "السلة"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="cart.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: t("Account", "حسابي"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
