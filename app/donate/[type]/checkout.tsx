// DonateCheckout.tsx
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'

type DonationItem = {
  item_description?: string | null
  item_amount?: number | string | null
  item_date?: string | null // ISO date string
  item_count?: number | null
}

type DonationInfo = {
  first_name?: string | null
  phone?: string | null
  pan?: string | null
  aadhaar?: string | null
  email?: string | null
  address1?: string | null
  address2?: string | null
  city?: string | null
  state_name?: string | null
  country_name?: string | null
  postal_code?: string | null | number
  donation_type?: { name?: string | null } | null
  items?: DonationItem[]
}

type Props = {
  donationInfo: DonationInfo
  setIsCheckoutLoading: (v: boolean) => void
  isCheckoutLoading: boolean
  payRazorpay: () => void
}

export default function DonateCheckout({
  donationInfo,
  isCheckoutLoading,
  payRazorpay,
}: Props) {
  const hasDate = donationInfo?.items?.some((item) => item.item_date != null)
  const { width } = useWindowDimensions()
  const isMdUp = width >= 768 // responsive breakpoint
  const router = useRouter()

  return (
    <ScrollView className="bg-white">
      <View className="mx-auto max-w-screen-md px-4 py-16">
        <View className="mb-5 items-center">
          <Text className="text-lg font-bold uppercase text-acmec-red">
            Verify Your Donation
          </Text>
        </View>

        {/* Donor Details */}
        <View className="space-y-4">
          <View className="rounded-lg border border-gray-200 bg-white p-5">
            <View className="gap-5">
              <View>
                <Text className="text-base font-bold text-acmec-red">Name</Text>
                <Text className="text-gray-700">
                  {donationInfo?.first_name ?? '-'}
                </Text>
              </View>

              <View>
                <Text className="text-base font-bold text-acmec-red">
                  Phone Number
                </Text>
                <Text className="text-gray-700">
                  {donationInfo?.phone ?? '-'}
                </Text>
              </View>

              {donationInfo?.pan && (
                <View>
                  <Text className="text-base font-bold text-acmec-red">
                    PAN No.
                  </Text>
                  <Text className="text-gray-700">{donationInfo.pan}</Text>
                </View>
              )}

              {donationInfo?.aadhaar && (
                <View>
                  <Text className="text-base font-bold text-acmec-red">
                    Aadhar No.
                  </Text>
                  <Text className="text-gray-700">{donationInfo.aadhaar}</Text>
                </View>
              )}

              <View className="col-span-full">
                <Text className="text-base font-bold text-acmec-red">
                  Email Address
                </Text>
                <Text className="text-gray-700">
                  {donationInfo?.email ?? '-'}
                </Text>
              </View>

              <View className="col-span-full">
                <Text className="text-base font-bold text-acmec-red">
                  Address
                </Text>
                <Text className="text-gray-700">
                  {donationInfo?.address1 ?? '-'}
                </Text>
                {donationInfo?.address2 && (
                  <Text className="text-gray-700">{donationInfo.address2}</Text>
                )}
                <Text className="text-gray-700">
                  {donationInfo?.city ?? '-'}, {donationInfo?.state_name ?? '-'}
                  , {donationInfo?.country_name ?? '-'} -{' '}
                  {donationInfo?.postal_code ?? '-'}
                </Text>
              </View>
            </View>
          </View>

          {/* Items */}
          <View className="rounded-lg border border-gray-200 bg-white p-5">
            {isMdUp ? (
              // Table style for larger screens
              <View className="overflow-hidden rounded-md border border-gray-200">
                <View className="flex-row bg-yellow-200/50">
                  <View className="flex-1 border-r border-gray-200 p-2">
                    <Text className="text-base font-bold text-acmec-red">
                      Donation Type
                    </Text>
                  </View>
                  <View className="w-36 border-r border-gray-200 p-2">
                    <Text className="text-base font-bold text-acmec-red">
                      Amount
                    </Text>
                  </View>
                  {hasDate && (
                    <View className="w-40 p-2">
                      <Text className="text-base font-bold text-acmec-red">
                        Date
                      </Text>
                    </View>
                  )}
                </View>

                {donationInfo?.items?.map((item, idx) => (
                  <View key={idx} className="flex-row border-t border-gray-200">
                    <View className="flex-1 border-r border-gray-200 p-2">
                      <Text className="text-gray-700">
                        {item.item_description ??
                          donationInfo?.donation_type?.name ??
                          '-'}
                      </Text>
                    </View>
                    <View className="w-36 border-r border-gray-200 p-2">
                      <Text className="text-gray-700">
                        Rs. {item.item_amount ?? '-'}
                      </Text>
                    </View>
                    {hasDate && (
                      <View className="w-40 p-2">
                        <Text className="text-gray-700">
                          {item.item_date
                            ? new Date(item.item_date).toLocaleDateString(
                                'en-GB',
                              )
                            : ''}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            ) : (
              // Card view for small screens
              <View className="space-y-4">
                {donationInfo?.items?.map((item, idx) => (
                  <View
                    key={idx}
                    className="space-y-2 rounded-lg border border-gray-200 p-4 shadow-sm"
                  >
                    <Text className="text-gray-700">
                      <Text className="font-bold">Donation Type: </Text>
                      {item.item_description ??
                        donationInfo?.donation_type?.name ??
                        '-'}
                    </Text>
                    <Text className="text-gray-700">
                      <Text className="font-bold">Amount: </Text>Rs.{' '}
                      {item.item_amount ?? '-'}
                    </Text>
                    {item.item_date && (
                      <Text className="text-gray-700">
                        <Text className="font-bold">Date: </Text>
                        {new Date(item.item_date).toLocaleDateString('en-GB')}
                      </Text>
                    )}
                    {item.item_count != null && (
                      <Text className="text-gray-700">
                        <Text className="font-bold">Qty: </Text>
                        {item.item_count}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Buttons */}
          <View className="mt-4 flex-row items-center justify-between">
            {!isCheckoutLoading ? (
              <Pressable
                onPress={payRazorpay}
                className="overflow-hidden rounded-lg"
              >
                <LinearGradient
                  colors={['rgba(204,0,0,0.95)', 'rgba(255,102,0,0.95)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="rounded-lg px-8 py-2"
                >
                  <Text className="font-bold text-white">
                    🔒 Pay Securely Now
                  </Text>
                </LinearGradient>
              </Pressable>
            ) : (
              <LinearGradient
                colors={['rgba(204,0,0,0.95)', 'rgba(255,102,0,0.95)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="flex-row items-center rounded-lg px-6 py-2"
              >
                <ActivityIndicator color="#fff" size="small" />
                <Text className="ml-3 font-bold text-white">
                  Please wait ...
                </Text>
              </LinearGradient>
            )}
          </View>

          {/* Back Button */}
          {/* <View className="mt-6">
            <Pressable
              onPress={() => router.back()}
              className="self-start rounded-xl border border-gray-300 px-4 py-2"
            >
              <Text className="text-gray-700">Back</Text>
            </Pressable>
          </View> */}
        </View>
      </View>
    </ScrollView>
  )
}
