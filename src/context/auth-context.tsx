// src/context/auth-context.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  triggerAuth: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("acmec.api_token");
      setIsAuthenticated(!!token);
    } catch (err) {
      console.error("Auth check error:", err);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const signOut = useCallback(async () => {
    try {
      await AsyncStorage.removeItem("acmec.api_token");
      await checkAuthStatus();
    } catch (err) {
      console.error("Sign out error", err);
    }
  }, [checkAuthStatus]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, triggerAuth: checkAuthStatus, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
