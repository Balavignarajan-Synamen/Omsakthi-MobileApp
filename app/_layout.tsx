import Footer from "@/src/components/Footer";
import Header from "@/src/components/Header";
import { Stack } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

export default function Layout() {
  return (
   <SafeAreaView className="flex-1 h-auto bg-[#FD580B1F]" edges={['left', 'right', 'bottom']}>
      {/* Header - placed at top */}
      <Header />

      {/* Main content area */}
      <View className="flex-1 " >
        <Stack screenOptions={{ headerShown: false }} />
      </View>

      {/* Footer - placed at bottom */}
      <Footer />
    </SafeAreaView>
  );
}
