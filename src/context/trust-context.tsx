import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePathname } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";

const TrustContext = createContext<any>(null);

export const TrustProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [selectedTrust, setSelectedTrust] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // Load saved trust on mount
  useEffect(() => {
    const loadTrust = async () => {
      try {
        setIsLoading(true);
        const stored = await AsyncStorage.getItem("selectedTrust");
        if (stored) {
          setSelectedTrust(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to load selectedTrust:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadTrust();
  }, []);

  // Clear trust when navigating to "/"
  useEffect(() => {
    if (pathname === "/") {
      setSelectedTrust(null);
      AsyncStorage.removeItem("selectedTrust");
      console.log("Cleared selectedTrust because user is on home page.");
    }
  }, [pathname]);

  // Save to storage whenever it changes
  useEffect(() => {
    const saveTrust = async () => {
      try {
        if (selectedTrust === null) {
          await AsyncStorage.removeItem("selectedTrust");
        } else {
          await AsyncStorage.setItem("selectedTrust", JSON.stringify(selectedTrust));
        }
      } catch (e) {
        console.error("Failed to save selectedTrust:", e);
      }
    };
    saveTrust();
  }, [selectedTrust]);

  return (
    <TrustContext.Provider value={{ selectedTrust, setSelectedTrust, isLoading }}>
      {children}
    </TrustContext.Provider>
  );
};

export const useTrust = () => useContext(TrustContext);