// app/donate/[type]/checkout.tsx
import React from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";

type Props = {
  donationInfo: any;
  setIsCheckoutLoading: (loading: boolean) => void;
  isCheckoutLoading: boolean;
  payRazorpay: () => void;
};

export default function DonateCheckout({
  donationInfo,
  setIsCheckoutLoading,
  isCheckoutLoading,
  payRazorpay,
}: Props) {
  const hasDate = donationInfo?.items?.some((item: any) => item.item_date != null);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768; // breakpoint for tablet

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 py-8">
      {/* Header */}
      <View className="items-center mb-5">
        <Text className="text-lg uppercase font-bold text-red-600">
          Verify Your Donation
        </Text>
      </View>

      {/* Donor Info */}
      <View className="border border-gray-200 bg-white rounded-lg p-5 mb-4">
        <View className="flex-row flex-wrap gap-4">
          <View className="w-[48%]">
            <Text className="text-base text-red-600 font-medium">Name</Text>
            <Text>{donationInfo?.first_name}</Text>
          </View>

          <View className="w-[48%]">
            <Text className="text-base text-red-600 font-medium">Phone Number</Text>
            <Text>{donationInfo?.phone}</Text>
          </View>

          {donationInfo?.pan && (
            <View className="w-[48%]">
              <Text className="text-base text-red-600 font-medium">PAN No.</Text>
              <Text>{donationInfo.pan}</Text>
            </View>
          )}

          {donationInfo?.aadhaar && (
            <View className="w-[48%]">
              <Text className="text-base text-red-600 font-medium">Aadhaar No.</Text>
              <Text>{donationInfo.aadhaar}</Text>
            </View>
          )}

          <View className="w-full">
            <Text className="text-base text-red-600 font-medium">Email Address</Text>
            <Text>{donationInfo?.email}</Text>
          </View>

          <View className="w-full">
            <Text className="text-base text-red-600 font-medium">Address</Text>
            <Text>{donationInfo?.address1}</Text>
            {donationInfo?.address2 && <Text>{donationInfo.address2}</Text>}
            <Text>
              {donationInfo?.city}, {donationInfo?.state_name},{" "}
              {donationInfo?.country_name} - {donationInfo?.postal_code}
            </Text>
          </View>
        </View>
      </View>

      {/* Donation Items */}
      <View className="border border-gray-200 bg-white rounded-lg p-5 mb-4">
        {isTablet ? (
          // Tablet view (like table)
          <View>
            <View className="flex-row bg-yellow-100 border-b border-gray-200">
              <Text className="flex-1 p-2 text-base font-medium text-red-600">
                Donation Type
              </Text>
              <Text className="w-28 p-2 text-base font-medium text-red-600">
                Amount
              </Text>
              {hasDate && (
                <Text className="w-28 p-2 text-base font-medium text-red-600">
                  Date
                </Text>
              )}
            </View>

            {donationInfo?.items?.map((item: any, index: number) => (
              <View key={index} className="flex-row border-t border-gray-200">
                <Text className="flex-1 p-2">{item?.item_name}</Text>
                <Text className="w-28 p-2">Rs. {item?.item_amount}</Text>
                {hasDate && (
                  <Text className="w-28 p-2">
                    {item?.item_date &&
                      new Date(item.item_date).toLocaleDateString("en-GB")}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ) : (
          // Mobile view (cards)
          <View className="space-y-4">
            {donationInfo?.items?.map((item: any, index: number) => (
              <View
                key={index}
                className="border rounded-lg p-4 shadow-sm space-y-2"
              >
                <Text className="font-medium text-gray-700">
                  Donation Type: <Text className="font-normal">{item?.item_name}</Text>
                </Text>
                <Text className="font-medium text-gray-700">
                  Amount: <Text className="font-normal">Rs. {item?.item_amount}</Text>
                </Text>
                {item?.item_date && (
                  <Text className="font-medium text-gray-700">
                    Date:{" "}
                    <Text className="font-normal">
                      {new Date(item.item_date).toLocaleDateString("en-GB")}
                    </Text>
                  </Text>
                )}
                {item?.item_count && (
                  <Text className="font-medium text-gray-700">
                    Qty: <Text className="font-normal">{item?.item_count}</Text>
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Pay Now Button */}
      <View className="flex-row justify-center">
        {!isCheckoutLoading ? (
          <TouchableOpacity
            onPress={payRazorpay}
            className="flex-row items-center bg-red-600 rounded-lg px-8 py-3"
          >
            <Text className="text-white font-bold">Pay Now</Text>
          </TouchableOpacity>
        ) : (
          <View className="flex-row items-center bg-red-600 rounded-lg px-8 py-3">
            <ActivityIndicator color="yellow" size="small" className="mr-2" />
            <Text className="text-white font-bold">Please wait ...</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
