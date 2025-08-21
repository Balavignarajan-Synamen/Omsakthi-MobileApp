// components/receipt.tsx
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

type DonateReceiptProps = {
  setIsReceiptLoading: (val: boolean) => void;
  isReceiptLoading: boolean;
  getDonationReceipt: () => void;
};

export default function DonateReceipt({
  setIsReceiptLoading,
  isReceiptLoading,
  getDonationReceipt,
}: DonateReceiptProps) {
  return (
    <View className="max-w-md mx-auto px-4 py-16">
      {/* Top Section */}
      <View className="flex flex-col items-center text-center space-y-3">
        <View className="flex items-center justify-center bg-red-500/10 p-4 rounded-full">
          {/* You might need to replace this with an icon from react-native-vector-icons */}
          <Text className="text-red-600 text-4xl">✓</Text>
        </View>

        <Text className="text-2xl font-semibold text-gray-800">Thank you!</Text>
        <Text className="text-base text-gray-700">
          Your donation has been received successfully.
        </Text>
        <Text className="text-sm text-gray-500">
          A receipt will be sent to the email you provided.
        </Text>
      </View>

      {/* Button Section */}
      <View className="flex items-center justify-center mt-7">
        {!isReceiptLoading ? (
          <TouchableOpacity
            onPress={getDonationReceipt}
            className="flex-row items-center gap-3 bg-red-600 px-8 py-2 rounded-lg"
          >
            <Text className="text-white font-bold">Click here to get receipt</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled
            className="flex-row items-center gap-3 bg-orange-500 px-8 py-2 rounded-lg"
          >
            <ActivityIndicator size="small" color="#fff" />
            <Text className="text-white font-bold">Please wait ...</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}