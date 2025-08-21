import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Swiper from 'react-native-swiper'
// import { apiCmsHomeSlider, apiGetTrusts } from "../services/api";
import { apiGetTrusts } from '@/src/services/api'
import { FontAwesome } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Link } from 'expo-router'
import 'setimmediate'

const { width } = Dimensions.get('window')

type Trust = {
  id: number
  name: string
  description: string
  logo?: string
}

export default function HomeScreen() {
  // const [sliders, setSliders] = useState<any[]>([])
  const [isSliderLoading, setIsSliderLoading] = useState(true)

  const [trustData, setTrustData] = useState<Trust[]>([])
  const [isTrustLoading, setIsTrustLoading] = useState(true)

  const [testimonials, setTestimonials] = useState<any[]>([])
  const [isTestimonialLoading, setIsTestimonialLoading] = useState(true)

  useEffect(() => {
    // fetchSliders()
    fetchTrusts()
    fetchTestimonials()
  }, [])

  // const fetchSliders = async () => {
  //   try {
  //     setIsSliderLoading(true)
  //     const res = await apiCmsHomeSlider('home_main')
  //     setSliders(res.data?.slides || [])
  //   } catch (err) {
  //     console.error('Slider API Error', err)
  //   } finally {
  //     setIsSliderLoading(false)
  //   }
  // }

  const fetchTrusts = async () => {
    try {
      setIsTrustLoading(true)
      const res = await apiGetTrusts()
      setTrustData(res.data?.data || [])
    } catch (err) {
      console.error('Trust API Error', err)
    } finally {
      setIsTrustLoading(false)
    }
  }

  const fetchTestimonials = () => {
    setTestimonials([
      {
        name: 'Amma Message',
        message:
          'தொடர்ந்து இருமுடி செலுத்தக் கணக்குப் பார்க்காதே‚ நீ செலுத்தும் ஒவ்வொரு இருமுடிக்கும் பயன் உண்டு',
      },
      {
        name: 'Amma Message',
        message:
          'மனித இனத்தை இறைவசமாக்க வேண்டியே இலவச இருமுடி போட்டு அழைத்துவரச் சொல்கிறேன்',
      },
      {
        name: 'Amma Message',
        message:
          'இருமுடியும் அன்னதானமும், உங்களையெல்லாம் இறைவசமாக்க உதவும் வழிகள்',
      },
      {
        name: 'Amma Message',
        message:
          'நான் கூறும் விதி முறைப்படி உண்மையாக விரதமிருந்து இருமுடி ஏந்தி வரும் சக்திகளை அழிவிலிருந்து காப்பாற்றுவேன்.',
      },
    ])
    setIsTestimonialLoading(false)
  }

  return (
    <FlatList
      ListHeaderComponent={
        // <View className="flex-1 max-h he bg-[#FD580B1F]">
        <SafeAreaView className="flex-1 border-none bg-[#FD580B1F]">
          {/* Section 1: Trusts */}
          <Text className="my-6 text-center text-xl font-bold  text-acmec-red md:text-3xl">
            Donate to Our Trusts
          </Text>
          {isTrustLoading ? (
            <ActivityIndicator size="large" className="my-6" />
          ) : (
            <FlatList
              data={trustData}
              keyExtractor={(item) => item.id.toString()}
              numColumns={width > 768 ? 2 : 1} // ✅ 2 per row for tablet, 1 for mobile
              columnWrapperStyle={
                width > 768 ? { justifyContent: 'space-around' } : undefined
              }
              renderItem={({ item }) => (
                <Link href={`/donate?trust_id=${item.id}`} asChild>
                  <TouchableOpacity
                    className="m-2 flex-1 overflow-hidden rounded-2xl"
                    activeOpacity={0.9}
                  >
                    <LinearGradient
                      colors={['#a7150bf2', '#fd580bf2']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      className="rounded-2xl p-4"
                    >
                      <View className="items-center">
                        {item.logo ? (
                          <Image
                            source={{ uri: item.logo }}
                            className="mb-3 h-20 w-20 rounded-full border-2 border-acmec-yellow"
                            resizeMode="contain"
                          />
                        ) : (
                          <View className="mb-3 h-16 w-16 items-center justify-center rounded-full bg-acmec-yellow">
                            <FontAwesome name="heart-o" size={18} color="red" />  
                          </View>
                        )}
                      </View>

                      <Text className="mb-2 text-center text-lg font-bold text-white">
                        {item.name}
                      </Text>
                      <Text className="text-center text-sm text-white">
                        {item.description}
                      </Text>
                      <View className="mt-4 items-center">
                        <LinearGradient
                          // colors={['#fff700f2', '#ff4d4df2']}
                          colors={['#fff700f2', '#ff6600f2', '#ff3333f2']}

                          end={{ x: 1, y: 1 }}
                          className="rounded-2xl p-2 "
                        >
                          <View className="flex-row items-center rounded-xl  px-6 py-2">
                            <Text className="mr-2 font-bold text-white text-xl">
                              Donate Now
                            </Text>
                            <FontAwesome
                              name="arrow-right"
                              size={18}
                              color="#fff"
                            />
                          </View>
                        </LinearGradient>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </Link>
              )}
            />
          )}

          {/* Section 2: Testimonials */}
          <Text className="my-6 text-center text-xl font-bold text-acmec-red md:text-3xl">
            Amma's Messages
          </Text>
          {isTestimonialLoading ? (
            <ActivityIndicator size="large" className="my-6" />
          ) : (
            <Swiper
              autoplay
              autoplayTimeout={7}
              loop
              height={250}
              showsPagination
              activeDotColor="#FF9800"
            >
              {testimonials.map((t, i) => (
                <LinearGradient
                  key={i}
                  colors={['#a7150bf2', '#fd580bf2']} // 95% opacity in hex: F2
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="mx-6 my-4 items-center justify-center rounded-2xl p-6"
                >
                  <Text className="mb-4 text-center italic text-white">
                    "{t.message}"
                  </Text>
                  <Text className="text-center text-lg font-bold text-acmec-yellow">
                    {t.name}
                  </Text>
                </LinearGradient>
              ))}
            </Swiper>
          )}
        </SafeAreaView>
      }
      data={[]} // no list, just using FlatList for scroll
      renderItem={null}
    />
  )
}
