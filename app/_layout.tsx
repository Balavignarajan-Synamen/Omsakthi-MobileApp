// app/_layout.tsx
import { Slot } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import "../global.css";

import {
  HeaderFollowBar,
  HeaderLogoBar,
  HeaderProfileBar,
} from "@/src/components/Header";
// import { HeaderFollowBar } from "";

import Footer from "@/src/components/Footer";

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#FD580B1F" /* same as web */ }}>
      <ScrollView
        // Make only the Profile bar sticky (index 2 of children below)
        stickyHeaderIndices={[2]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Header pieces */}
        <HeaderFollowBar />
        <HeaderLogoBar />
        <HeaderProfileBar />

        {/* Main content rendered by current route */}
        <View style={{ flex: 1 }}>
          <Slot />
        </View>

        {/* Footer (NOT sticky) */}
        <Footer />
      </ScrollView>
    </View>
  );
}
