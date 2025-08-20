// app/donate/[type]/receipt.tsx
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { CheckCircleIcon } from "react-native-heroicons/outline";

type Props = {
  isGetReceiptLoading: boolean;
  getDonationReceipt: () => void;
};

export default function DonateReceipt({
  isGetReceiptLoading,
  getDonationReceipt,
}: Props) {
  return (
    <View className="flex-1 bg-gray-50 px-4 py-16">
      {/* Success Message */}
      <View className="flex-col items-center text-center space-y-3">
        <View className="items-center justify-center bg-red-100 p-4 rounded-full">
          <CheckCircleIcon size={48} color="#dc2626" /> 
          {/* red-600 color */}
        </View>

        <Text className="text-2xl font-semibold text-gray-800">Thank you!</Text>
        <Text className="text-base text-gray-700">
          Your donation has been received successfully.
        </Text>
        <Text className="text-sm text-gray-500">
          A receipt will be sent to the email you provided.
        </Text>
      </View>

      {/* Button */}
      <View className="items-center justify-center mt-7">
        {!isGetReceiptLoading ? (
          <TouchableOpacity
            onPress={getDonationReceipt}
            className="flex-row items-center bg-red-600 rounded-lg px-8 py-3"
          >
            <Text className="text-white font-bold">Click here to get receipt</Text>
          </TouchableOpacity>
        ) : (
          <View className="flex-row items-center bg-yellow-500 rounded-lg px-8 py-3">
            <ActivityIndicator color="#fff" size="small" className="mr-2" />
            <Text className="text-white font-bold">Please wait ...</Text>
          </View>
        )}
      </View>
    </View>
  );
}
