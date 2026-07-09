import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageProvider";
import api from "../services/api";

export default function LoginScreen() {
  const { lang, t } = useLanguage();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const executeLogin = async (user: any, token: string) => {
    const currentDevice = Device.modelName || "unknown";
    try {
      // FALLBACK: Use AsyncStorage on Web, SecureStore on Mobile
      if (Platform.OS === "web") {
        await AsyncStorage.setItem("user_token", token);
      } else {
        // FIXED: Using standard documented Expo API call
        await SecureStore.setItemAsync("userToken", token);
      }

      await login(user, token, currentDevice);
    } catch (error) {
      console.error("Token storage error:", error);
      Alert.alert(t("Error"), "Failed to secure session.");
    }
  };

  const handlePasswordLogin = async () => {
    if (!username || !password) {
      Alert.alert(
        t("Required", "مطلوب"),
        t("Please fill all fields", "يرجى ملء جميع الحقول"),
      );
      return;
    }

    setLoading(true);
    try {
      const cleanUsername = username.trim().toLowerCase();
      const cleanPassword = password.trim();

      const response = await api.post("/api/login", {
        username: cleanUsername,
        password: cleanPassword,
      });

      if (response.data.token) {
        await executeLogin(response.data.user, response.data.token);
      }
    } catch (error: any) {
      console.log(
        "Login Error Details:",
        error.response?.data || error.message,
      );

      const errorMessage =
        error.response?.status === 401
          ? t("Invalid credentials", "بيانات غير صالحة")
          : "Server error. Please try again later.";

      Alert.alert(t("Error", "خطأ"), errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isRTL = lang === "ar";

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inner}
      >
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="shield-checkmark" size={60} color="#FFD700" />
          </View>
          <Text style={styles.welcomeText}>
            {t("Welcome Back", "مرحباً بك")}
          </Text>
          <Text style={styles.subText}>{t("Secure Access", "وصول آمن")}</Text>
        </View>

        <View style={styles.formSection}>
          <View
            style={[
              styles.inputWrapper,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { textAlign: isRTL ? "right" : "left" }]}
              placeholder={t("Username", "اسم المستخدم")}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View
            style={[
              styles.inputWrapper,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { textAlign: isRTL ? "right" : "left" }]}
              placeholder={t("Password", "كلمة المرور")}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && { opacity: 0.7 }]}
            onPress={handlePasswordLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.loginButtonText}>
                {t("Sign In", "تسجيل الدخول")}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 noon.com</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: { flex: 1, padding: 30, justifyContent: "center" },
  headerSection: { alignItems: "center", marginBottom: 40 },
  logoContainer: {
    width: 90,
    height: 90,
    backgroundColor: "#000",
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 4,
  },
  welcomeText: { fontSize: 22, fontWeight: "bold", color: "#000" },
  subText: { fontSize: 13, color: "#888", marginTop: 5 },
  formSection: { width: "100%" },
  inputWrapper: {
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#efefef",
  },
  inputIcon: { marginHorizontal: 8 },
  input: { flex: 1, fontSize: 16, color: "#000" },
  loginButton: {
    backgroundColor: "#FFD700",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
    elevation: 2,
  },
  loginButtonText: { fontSize: 16, fontWeight: "bold", color: "#000" },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  footerText: { fontSize: 11, color: "#ccc" },
});
