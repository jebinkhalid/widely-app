import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { LanguageProvider } from "../context/LanguageProvider";
import LoginScreen from "./login"; // Ensure this path is correct

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // 1. Check login status on app launch
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const status = await AsyncStorage.getItem("isLoggedIn");
        setIsAuthenticated(status === "true");
      } catch (e) {
        setIsAuthenticated(false);
      }
    };
    checkLogin();
  }, []);

  // 2. Login Handler
  const handleLogin = async () => {
    try {
      await AsyncStorage.setItem("isLoggedIn", "true");
      setIsAuthenticated(true);
    } catch (e) {
      console.error(e);
    }
  };

  // 3. Show a loading spinner while checking storage to prevent "flash"
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
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        {/* 4. GATEKEEPER LOGIC */}
        {!isAuthenticated ? (
          <LoginScreen onLogin={handleLogin} />
        ) : (
          <>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{ presentation: "modal", title: "Modal" }}
              />
            </Stack>
            <StatusBar style="auto" />
          </>
        )}
      </ThemeProvider>
    </LanguageProvider>
  );
}
