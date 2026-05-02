import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import React, { useState } from "react";
import {
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
import { useLanguage } from "../context/LanguageProvider";
import { VALID_USERS } from "./constants/Users";

export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const { lang, t } = useLanguage();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Check if user exists in our constants
    const user = VALID_USERS.find(
      (u) => u.username === cleanUsername && u.password === cleanPassword,
    );

    if (user) {
      const currentDevice = Device.modelName || "unknown";

      try {
        // 2. Check for Device Lock
        const registeredDevice = await AsyncStorage.getItem(
          `device_for_${cleanUsername}`,
        );

        if (registeredDevice && registeredDevice !== currentDevice) {
          Alert.alert(
            t("Access Denied", "تم رفض الوصول"),
            t(
              "This account is already linked to another device.",
              "هذا الحساب مرتبط بالفعل بجهاز آخر.",
            ),
          );
        } else {
          // 3. SUCCESS: Save session data
          await AsyncStorage.setItem("isLoggedIn", "true");
          await AsyncStorage.setItem(
            `device_for_${cleanUsername}`,
            currentDevice,
          );

          // Store full name for the Account screen
          const fullName =
            cleanUsername === "rashi" ? "Rashid Mohammed" : cleanUsername;
          await AsyncStorage.setItem("user_full_name", fullName);

          // 4. Update the App State
          onLogin();
        }
      } catch (error) {
        console.error("Storage Error:", error);
        Alert.alert("Error", "Something went wrong with storage.");
      }
    } else {
      Alert.alert(
        t("Error", "خطأ"),
        t("Invalid credentials", "بيانات الاعتماد غير صالحة"),
      );
    }
  };

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
            {t("Welcome Back", "مرحباً بك مجدداً")}
          </Text>
          <Text style={styles.subText}>
            {t("Please sign in to continue", "الرجاء تسجيل الدخول للمتابعة")}
          </Text>
        </View>

        <View style={styles.formSection}>
          {/* Username Input */}
          <View
            style={[
              styles.inputWrapper,
              { flexDirection: lang === "ar" ? "row-reverse" : "row" },
            ]}
          >
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input,
                { textAlign: lang === "ar" ? "right" : "left" },
              ]}
              placeholder={t("Username", "اسم المستخدم")}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
          </View>

          {/* Password Input */}
          <View
            style={[
              styles.inputWrapper,
              { flexDirection: lang === "ar" ? "row-reverse" : "row" },
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input,
                { textAlign: lang === "ar" ? "right" : "left" },
              ]}
              placeholder={t("Password", "كلمة المرور")}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>
              {t("Sign In", "تسجيل الدخول")}
            </Text>
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color="#888"
            />
            <Text style={styles.infoText}>
              {t(
                "Accounts are restricted to one device at a time.",
                "الحسابات مقيدة بجهاز واحد فقط في المرة الواحدة.",
              )}
            </Text>
          </View>
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
    width: 100,
    height: 100,
    backgroundColor: "#000",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 5,
  },
  welcomeText: { fontSize: 24, fontWeight: "bold", color: "#000" },
  subText: { fontSize: 14, color: "#666", marginTop: 8 },
  formSection: { width: "100%" },
  inputWrapper: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  inputIcon: { marginHorizontal: 10 },
  input: { flex: 1, fontSize: 16, color: "#000" },
  loginButton: {
    backgroundColor: "#FFD700",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
    elevation: 2,
  },
  loginButtonText: { fontSize: 16, fontWeight: "bold", color: "#000" },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  infoText: { fontSize: 12, color: "#888", marginLeft: 5 },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  footerText: { fontSize: 12, color: "#bbb" },
});
