import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";

// 1. Import your Providers
import { AuthProvider, useAuth } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { LanguageProvider } from "../context/LanguageProvider";
import { WishlistProvider } from "../context/WishlistProvider";
import LoginScreen from "./login";

// This inner component is where the logic happens
function RootLayoutNav() {
  const { user, isLoading, login } = useAuth(); // 👈 Get everything from Context

  // Show a loading spinner while AuthContext checks AsyncStorage
  if (isLoading) {
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
    <ThemeProvider value={DefaultTheme}>
      {/* 2. If no user is logged in, show the LoginScreen */}
      {!user ? (
        <LoginScreen onLogin={login} />
      ) : (
        /* 3. If logged in, show the App Stack */
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="wishlist"
            options={{
              presentation: "card",
              headerShown: true,
              headerTitle: "Wishlist",
            }}
          />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
      )}
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}

// This is the Main Export that wraps everything in Providers
export default function RootLayout() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <WishlistProvider>
          <CartProvider>
            <RootLayoutNav />
          </CartProvider>
        </WishlistProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
