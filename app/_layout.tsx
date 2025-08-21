// app/_layout.tsx
import { Slot } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, View, useWindowDimensions } from "react-native";
import "../global.css";

import Footer from "@/src/components/Footer";
import {
  HeaderFollowBar,
  HeaderLogoBar,
  HeaderProfileBar,
} from "@/src/components/Header";

import { AuthProvider } from "@/src/context/auth-context";
// import { TrustProvider } from "@/src/context/trustContext";
import { TrustProvider } from "@/src/context/trust-context";

export default function RootLayout() {
  const { width } = useWindowDimensions();

  // Responsive logic
  const isTablet = width >= 768;
  const isDesktop = width >= 1024;

  return (
    <TrustProvider>
      <AuthProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FD580B1F" }}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "space-between",
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View>
              <HeaderFollowBar />
              <HeaderLogoBar />
              <HeaderProfileBar />
            </View>

            {/* Main content (dynamic pages via Slot) */}
            <View
              style={{
                flex: 1,
                paddingHorizontal: isDesktop ? 40 : isTablet ? 24 : 12,
                marginVertical: 12,
              }}
            >
              <Slot />
            </View>

            {/* Footer */}
            <View
              style={{
                paddingHorizontal: isDesktop ? 32 : isTablet ? 20 : 10,
                paddingBottom: isTablet ? 20 : 10,
              }}
            >
              <Footer />
            </View>
          </ScrollView>
        </SafeAreaView>
      </AuthProvider>
    </TrustProvider>
  );
}
