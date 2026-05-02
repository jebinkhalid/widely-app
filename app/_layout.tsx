import AsyncStorage from "@react-native-async-storage/async-storage";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";

import { CartProvider } from "../context/CartContext";
import { LanguageProvider } from "../context/LanguageProvider";
import { WishlistProvider } from "../context/WishlistProvider"; // 👈 Added this import
import LoginScreen from "./login";
export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const segments = useSegments();

  const checkLogin = async () => {
    try {
      const status = await AsyncStorage.getItem("isLoggedIn");
      setIsAuthenticated(status === "true");
    } catch (e) {
      setIsAuthenticated(false);
    }
  };
  useEffect(() => {
    checkLogin();
  }, [segments]);
  const handleLogin = async () => {
    await AsyncStorage.setItem("isLoggedIn", "true");
    setIsAuthenticated(true);
  };
  if (isAuthenticated === null) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <LanguageProvider>
      <WishlistProvider>
        <CartProvider>
          <ThemeProvider value={DefaultTheme}>
            {!isAuthenticated ? (
              <LoginScreen onLogin={handleLogin} />
            ) : (
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                {/* 👈 Ensure wishlist is registered if not in (tabs) */}
                <Stack.Screen
                  name="wishlist"
                  options={{
                    presentation: "card",
                    headerShown: true,
                    headerTitle: "Wishlist",
                  }}
                />
                <Stack.Screen
                  name="modal"
                  options={{ presentation: "modal" }}
                />
              </Stack>
            )}
            <StatusBar style="dark" />
          </ThemeProvider>
        </CartProvider>
      </WishlistProvider>
    </LanguageProvider>
  );
}
