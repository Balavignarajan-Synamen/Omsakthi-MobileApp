
import { Slot } from "expo-router";
import React from "react";
import { View } from "react-native";
import "../global.css";

import Footer from "@/src/components/Footer";
import {
  HeaderFollowBar,
  HeaderLogoBar,
  HeaderProfileBar,
} from "@/src/components/Header";
import { AuthProvider } from "@/src/context/auth-context";

export default function RootLayout() {
  return (
    <AuthProvider>
  <View style={{ flex: 1, backgroundColor: "#FD580B1F" }}>
    {/* Header pieces */}
    <HeaderFollowBar />
    <HeaderLogoBar />
    <HeaderProfileBar />

    {/* Main content rendered by current route */}
    <View style={{ flex: 1 }}>
      <Slot />
    </View>

    {/* Footer */}
    <Footer />
  </View>
</AuthProvider>

  );
}
