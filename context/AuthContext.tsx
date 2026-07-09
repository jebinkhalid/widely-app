import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

// Define the User shape
interface User {
  id?: string; // 👈 Added this line to store the MongoDB unique user ID
  username: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string, deviceId: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user and token from storage on app boot
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user_session");
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to load user", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  // Updated login to store the token
  const login = async (userData: User, token: string, deviceId: string) => {
    setUser(userData);
    await AsyncStorage.setItem("user_session", JSON.stringify(userData));
    await AsyncStorage.setItem("userToken", token); // Storing the JWT
    await AsyncStorage.setItem(`device_for_${userData.username}`, deviceId);
  };

  // Updated logout to clear the token
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user_session");
    await AsyncStorage.removeItem("userToken"); // Removing the JWT
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
