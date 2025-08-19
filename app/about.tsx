import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-blue-600">About Us Bala</Text>
      <Text className="mt-2 text-gray-700">Email: trust@example.com</Text>
    </SafeAreaView>
  );
}
