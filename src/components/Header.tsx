// src/components/HeaderSections.tsx
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Sidebar from "./Sidebar";

const COLORS = {
  yellow: "#ffc107",
  red: "#a7150b",
  redGradientStart: "#a7150bf2",
  redGradientEnd: "#fd580bf2",
  white: "#ffffff",
};

const useScreen = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  return { width, isTablet };
};

/** 1) Follow Bar (scrolls away) */
export function HeaderFollowBar() {
  const { width, isTablet } = useScreen();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.followButton,
        { width, paddingTop: insets.top }, // respect the notch at the very top
      ]}
    >
      <Text style={styles.followText}>Follow us :</Text>
      <FontAwesome
        name="youtube-play"
        size={isTablet ? 36 : 18}
        color="red"
        style={{ marginLeft: 8 }}
      />
    </View>
  );
}

/** 2) Logo Bar (scrolls away) */
export function HeaderLogoBar() {
  const { width, isTablet } = useScreen();

  return (
    <LinearGradient
      colors={[COLORS.redGradientStart, COLORS.redGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.logoContainer}
    >
<Link href="/" asChild>
  <Pressable>
    <Image
      source={require("../../assets/images/logoacmec-footer.png")}
      style={{
        width: isTablet ? width * 0.6 : width * 0.8,
        height: isTablet ? 70 : 50,
        alignSelf: "center",
      }}
      resizeMode="contain"
    />
  </Pressable>
</Link>


    </LinearGradient>
  );
}

/** 3) Profile Bar (STICKY) */
export function HeaderProfileBar() {
  const { width, isTablet } = useScreen();
  const insets = useSafeAreaInsets();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => setIsSidebarVisible((s) => !s);

  return (
    <>
      <View
        style={[
          styles.profileButton,
          {
            width,
            paddingTop: Math.max(10, insets.top * 0.6), // keep comfy when stuck under status bar
            zIndex: 10,
            elevation: 4,
          },
        ]}
      >
        <Text style={styles.profileText}>Profile</Text>
        <TouchableOpacity onPress={toggleSidebar} accessibilityRole="button">
          <FontAwesome name="bars" size={isTablet ? 36 : 30} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <Sidebar
        isVisible={isSidebarVisible}
        onClose={toggleSidebar}
        onLogin={() => {
          console.log("Login pressed");
          setIsSidebarVisible(false);
        }}
        onSignup={() => {
          console.log("Signup pressed");
          setIsSidebarVisible(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  followButton: {
    backgroundColor: COLORS.yellow,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  followText: {
    fontSize: 14,
    fontWeight: "bold",
  },

  logoContainer: {
    paddingVertical: 4,
  },

  profileButton: {
    backgroundColor: COLORS.red,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileText: {
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "#ffffff",
    color: "#dc2626",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
});
