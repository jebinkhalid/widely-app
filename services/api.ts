// services/api.ts
import axios, { AxiosInstance } from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const api: AxiosInstance = axios.create({
  baseURL: "https://widely-backend-production-e6ad.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    let token = null;

    try {
      if (Platform.OS === "web") {
        // Use localStorage for browser testing
        token = localStorage.getItem("user_token");
      } else {
        // Use SecureStore for iPhone/Android
        token = await SecureStore.getItemAsync("user_token");
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("🚀 Token attached to request");
      }
    } catch (error) {
      console.error("Auth Interceptor Error:", error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
