// app/donate.tsx (Expo Router)
import Breadcrumb from '@/src/components/breadcrumb'
import { apiDonationTypes } from '@/src/services/api'
import { handleApiErrors } from '@/src/utils/helper/api.helper'
import { LinearGradient } from 'expo-linear-gradient'
import { Link, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

export default function Donate() {
  const { trust_id } = useLocalSearchParams() // ✅ get trust id from URL
  const [isTypeLoading, setIsTypeLoading] = useState(true)
  const [types, setTypes] = useState<any[]>([])

  const screenWidth = Dimensions.get('window').width

  // ✅ Define breadcrumb here
  const breadcrumb = {
    title: 'Donate',
    path: [{ label: 'Home', link: 'index' }, { label: 'Donate' }],
  }

  useEffect(() => {
    fetchDonationTypes()
  }, [])

  const fetchDonationTypes = () => {
    setIsTypeLoading(true)

    const params = { trust_id }
    apiDonationTypes(params)
      .then((res: any) => {
        setTypes(res?.data || [])
        setIsTypeLoading(false)
      })
      .catch((err: any) => {
        const message: string | null = handleApiErrors(err)
        if (message) console.error(message)
        setIsTypeLoading(false)
      })
  }

  return (
    <View className="flex-1 bg-white">
      <Breadcrumb breadcrumb={breadcrumb} />

      {/* Title */}
      <View className="mt-6 items-center">
        <Text className="text-2xl font-bold text-acmec-red">Donate Now</Text>
        <View className="mt-2 h-1 w-20 bg-gradient-to-r from-acmec-red to-acmec-orange" />
      </View>

      {/* Loading State */}
      {isTypeLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#a7150b" />
        </View>
      ) : (
        <FlatList
          data={types}
          // keyExtractor={(item) => item.id}
          keyExtractor={(item, index) =>
            item?.id?.toString() ?? index.toString()
          }
          numColumns={screenWidth > 768 ? 3 : screenWidth > 480 ? 2 : 1} // ✅ responsive: 1 col mobile, 2 col small tab, 3 col large tab
          columnWrapperStyle={
            screenWidth > 480 ? { justifyContent: 'space-around' } : undefined
          }
          contentContainerStyle={{ padding: 12 }}
          renderItem={({ item }) => (
            <Link
              href={`/donate/${item.slug}?trust_id=${trust_id}` as any}
              asChild
            >
              <TouchableOpacity
                activeOpacity={0.9}
                className="m-2 flex-1 overflow-hidden rounded-2xl"
              >
                <LinearGradient
                  colors={['#ffffff', '#fff7e6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="rounded-2xl border-2 border-acmec-yellow p-6"
                >
                  <View className="items-center">
                    {/* Fake Icon Example — replace with your icons */}
                    {/* <View className="w-16 h-16 rounded-full bg-red- items-center justify-center mb-3"> */}
                    <Text className="text-xl text-acmec-red">🙏</Text>
                    {/* <FontAwesome name="heart-o" size={18} color="red" /> */}
                    {/* </View> */}

                    <Text className="mb-2 text-center text-lg font-bold text-acmec-red">
                      {item.name}
                    </Text>

                    <View className="mt-2 rounded-lg bg-gradient-to-r from-acmec-yellow to-acmec-orange px-4 py-2">
                      <Text className="font-bold text-white">Donate Now →</Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Link>
          )}
          ListEmptyComponent={
            <View className="mt-10 flex-1 items-center justify-center">
              <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-acmec-yellow to-acmec-orange">
                <Text className="text-3xl font-bold text-acmec-red">!</Text>
              </View>
              <Text className="mb-2 text-xl font-bold text-acmec-red">
                No Donation Types Available
              </Text>
              <Text className="px-6 text-center text-gray-600">
                We're currently setting up donation types. Please check back
                later or contact us for more information.
              </Text>
            </View>
          }
        />
      )}
    </View>
  )
}
