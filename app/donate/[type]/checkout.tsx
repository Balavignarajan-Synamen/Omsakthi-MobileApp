import React from 'react'
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

type DonateCheckoutProps = {
  donationInfo: any
  setIsCheckoutLoading: (val: boolean) => void
  isCheckoutLoading: boolean
  payRazorpay: () => void
}

export default function DonateCheckout({
  donationInfo,
  isCheckoutLoading,
  payRazorpay,
}: DonateCheckoutProps) {
  const hasDate = donationInfo?.items?.some(
    (item: any) => item.item_date != null,
  )

  return (
    <ScrollView className="mx-auto max-w-md px-4 py-16">
      {/* Title */}
      <View className="mb-5 text-center">
        <Text className="text-lg font-bold uppercase text-red-600">
          Verify Your Donation
        </Text>
      </View>

      {/* Donor Info */}
      <View className="mb-5 rounded-lg border border-gray-200 bg-white p-5">
        <View className="flex flex-row flex-wrap gap-5">
          <View className="w-1/2">
            <Text className="text-base font-medium text-red-600">Name</Text>
            <Text>{donationInfo?.first_name}</Text>
          </View>

          <View className="w-1/2">
            <Text className="text-base font-medium text-red-600">
              Phone Number
            </Text>
            <Text>{donationInfo?.phone}</Text>
          </View>

          {donationInfo?.pan && (
            <View className="w-1/2">
              <Text className="text-base font-medium text-red-600">
                PAN No.
              </Text>
              <Text>{donationInfo?.pan}</Text>
            </View>
          )}

          {donationInfo?.aadhaar && (
            <View className="w-1/2">
              <Text className="text-base font-medium text-red-600">
                Aadhar No.
              </Text>
              <Text>{donationInfo?.aadhaar}</Text>
            </View>
          )}

          <View className="w-full">
            <Text className="text-base font-medium text-red-600">
              Email Address
            </Text>
            <Text>{donationInfo?.email}</Text>
          </View>

          <View className="w-full">
            <Text className="text-base font-medium text-red-600">Address</Text>
            <Text>{donationInfo?.address1}</Text>
            {donationInfo?.address2 && <Text>{donationInfo.address2}</Text>}
            <Text>
              {donationInfo?.city}, {donationInfo?.state_name},{' '}
              {donationInfo?.country_name} - {donationInfo?.postal_code}
            </Text>
          </View>
        </View>
      </View>

      {/* Donation Items */}
      <View className="mb-5 rounded-lg border border-gray-200 bg-white p-5">
        {donationInfo?.items?.map((item: any, index: number) => (
          <View
            key={index}
            className="mb-4 space-y-2 rounded-lg border p-4 shadow-sm"
          >
            <Text className="font-medium text-gray-700">
              Donation Type:{' '}
              <Text className="font-normal">{item?.item_name}</Text>
            </Text>
            <Text className="font-medium text-gray-700">
              Amount:{' '}
              <Text className="font-normal">Rs. {item?.item_amount}</Text>
            </Text>
            {hasDate && item?.item_date && (
              <Text className="font-medium text-gray-700">
                Date:{' '}
                <Text className="font-normal">
                  {new Date(item.item_date).toLocaleDateString('en-GB')}
                </Text>
              </Text>
            )}
            {item?.item_count != null && (
              <Text className="font-medium text-gray-700">
                Qty: <Text className="font-normal">{item?.item_count}</Text>
              </Text>
            )}
          </View>
        ))}
      </View>

      {/* Payment Button */}
      <View className="flex flex-row items-center justify-between">
        {!isCheckoutLoading ? (
          <TouchableOpacity
            onPress={payRazorpay}
            className="flex-row items-center gap-3 rounded-lg bg-red-600 px-8 py-2"
          >
            <Text className="font-bold text-white">Pay Now</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled
            className="flex-row items-center gap-3 rounded-lg bg-red-600 px-8 py-2"
          >
            <ActivityIndicator size="small" color="#fff" />
            <Text className="font-bold text-white">Please wait ...</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  )
}
