import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import Swiper from "react-native-swiper";
// import { apiCmsHomeSlider, apiGetTrusts } from "../services/api";
import { apiCmsHomeSlider, apiGetTrusts } from "@/src/services/api";
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from "react-native-safe-area-context";



const { width } = Dimensions.get("window");

type Trust = {
  id: number;
  name: string;
  description: string;
  logo?: string;
};

export default function HomeScreen() {
  const [sliders, setSliders] = useState<any[]>([]);
  const [isSliderLoading, setIsSliderLoading] = useState(true);

  const [trustData, setTrustData] = useState<Trust[]>([]);
  const [isTrustLoading, setIsTrustLoading] = useState(true);

  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isTestimonialLoading, setIsTestimonialLoading] = useState(true);

  useEffect(() => {
    fetchSliders();
    fetchTrusts();
    fetchTestimonials();
  }, []);

  const fetchSliders = async () => {
    try {
      setIsSliderLoading(true);
      const res = await apiCmsHomeSlider("home_main");
      setSliders(res.data?.slides || []);
    } catch (err) {
      console.error("Slider API Error", err);
    } finally {
      setIsSliderLoading(false);
    }
  };

  const fetchTrusts = async () => {
    try {
      setIsTrustLoading(true);
      const res = await apiGetTrusts();
      setTrustData(res.data?.data || []);
    } catch (err) {
      console.error("Trust API Error", err);
    } finally {
      setIsTrustLoading(false);
    }
  };

  const fetchTestimonials = () => {
    setTestimonials([
       { name: "Amma Message", message: "தொடர்ந்து இருமுடி செலுத்தக் கணக்குப் பார்க்காதே‚ நீ செலுத்தும் ஒவ்வொரு இருமுடிக்கும் பயன் உண்டு" },
            { name: "Amma Message", message: "மனித இனத்தை இறைவசமாக்க வேண்டியே இலவச இருமுடி போட்டு அழைத்துவரச் சொல்கிறேன்" },
            { name: "Amma Message", message: "இருமுடியும் அன்னதானமும், உங்களையெல்லாம் இறைவசமாக்க உதவும் வழிகள்" },
            { name: "Amma Message", message: "நான் கூறும் விதி முறைப்படி உண்மையாக விரதமிருந்து இருமுடி ஏந்தி வரும் சக்திகளை அழிவிலிருந்து காப்பாற்றுவேன்." },
    ]);
    setIsTestimonialLoading(false);
  };

  return (
    <FlatList
      ListHeaderComponent={
        // <View className="flex-1 max-h he bg-[#FD580B1F]">
        <SafeAreaView className="flex-1 border-none bg-[#FD580B1F]" >

          {/* Section 1: Trusts */}
          <Text className="text-xl md:text-3xl font-bold text-center  text-acmec-red my-6">
            Donate to Our Trusts
          </Text>
          {isTrustLoading ? (
            <ActivityIndicator size="large" className="my-6" />
          ) : (
            <FlatList
              data={trustData}
              keyExtractor={(item) => item.id.toString()}
              numColumns={width > 768 ? 3 : 2} // responsive: 3 cols on tablets, 2 on mobile
              columnWrapperStyle={{ justifyContent: "space-around" }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="bg-acmec-red rounded-2xl p-4 m-2 flex-1"
                  onPress={() => console.log(`Donate to trust ${item.id}`)}
                >
                  <View className="items-center">
                    {item.logo ? (
                      <Image
                        source={{ uri: item.logo }}
                        className="w-20 h-20 rounded-full border-2 border-acmec-yellow mb-3"
                        resizeMode="contain"
                      />
                    ) : (
                      <View className="w-16 h-16 rounded-full bg-acmec-yellow items-center justify-center mb-3">
                        <Text className="text-acmec-red font-bold text-lg">T</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-white text-lg font-bold text-center mb-2">
                    {item.name}
                  </Text>
                  <Text className="text-white text-sm text-center">
                    {item.description}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}

          {/* Section 2: Testimonials */}
          <Text className="text-xl md:text-3xl font-bold text-center text-acmec-red my-6">
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
    className="rounded-2xl mx-6 my-4 p-6 items-center justify-center"
  >
    <Text className="text-white italic text-center mb-4">
      "{t.message}"
    </Text>
    <Text className="text-acmec-yellow font-bold text-lg text-center">
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
  );
}
