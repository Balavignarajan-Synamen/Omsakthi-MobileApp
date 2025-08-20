// app/donate.tsx (Expo Router)
import Breadcrumb from "@/src/components/breadcrumb";
import { apiDonationTypes } from "@/src/services/api";
import { handleApiErrors } from "@/src/utils/helper/api.helper";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Text, TouchableOpacity, View } from "react-native";

export default function Donate() {
  const { trust_id } = useLocalSearchParams(); // ✅ get trust id from URL
  const [isTypeLoading, setIsTypeLoading] = useState(true);
  const [types, setTypes] = useState<any[]>([]);

  const screenWidth = Dimensions.get("window").width;

   // ✅ Define breadcrumb here
  const breadcrumb = {
    title: "Donate",
    path: [
      { label: "Home", link: "index" }, // 👈 adjust to your route names in Expo Router
      { label: "Donate" },
    ],
  };

  useEffect(() => {
    fetchDonationTypes();
  }, []);

  const fetchDonationTypes = () => {
    setIsTypeLoading(true);

    const params = { trust_id };
    apiDonationTypes(params)
      .then((res: any) => {
        setTypes(res?.data || []);
        setIsTypeLoading(false);
      })
      .catch((err: any) => {
        const message: string | null = handleApiErrors(err);
        if (message) console.error(message);
        setIsTypeLoading(false);
      });
  };

  return (
    <View className="flex-1 bg-white">
            <Breadcrumb breadcrumb={breadcrumb} />

      {/* Title */}
      <View className="items-center mt-6">
        <Text className="text-2xl font-bold text-acmec-red">Donate Now</Text>
        <View className="w-20 h-1 bg-gradient-to-r from-acmec-red to-acmec-orange mt-2" />
      </View>

      {/* Loading State */}
      {isTypeLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#a7150b" />
        </View>
      ) : (
        <FlatList
          data={types}
          keyExtractor={(item) => item.id}
          numColumns={screenWidth > 768 ? 3 : screenWidth > 480 ? 2 : 1} // ✅ responsive: 1 col mobile, 2 col small tab, 3 col large tab
          columnWrapperStyle={
            screenWidth > 480 ? { justifyContent: "space-around" } : undefined
          }
          contentContainerStyle={{ padding: 12 }}
          renderItem={({ item }) => (
            <Link href={`/donate/${item.slug}?trust_id=${trust_id}` as any} asChild>
              <TouchableOpacity
                activeOpacity={0.9}
                className="m-2 flex-1 rounded-2xl overflow-hidden"
              >
                <LinearGradient
                  colors={["#ffffff", "#fff7e6"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="rounded-2xl p-6 border-2 border-acmec-yellow"
                >
                  <View className="items-center">
                    {/* Fake Icon Example — replace with your icons */}
                    <View className="w-16 h-16 rounded-full bg-acmec-yellow/30 items-center justify-center mb-3">
                      <Text className="text-xl text-acmec-red">★</Text>
                    </View>

                    <Text className="text-lg font-bold text-acmec-red text-center mb-2">
                      {item.name}
                    </Text>

                    <View className="mt-2 px-4 py-2 rounded-lg bg-gradient-to-r from-acmec-yellow to-acmec-orange">
                      <Text className="text-white font-bold">Donate Now →</Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Link>
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-10">
              <View className="w-24 h-24 rounded-full bg-gradient-to-br from-acmec-yellow to-acmec-orange items-center justify-center mb-4">
                <Text className="text-3xl text-acmec-red font-bold">!</Text>
              </View>
              <Text className="text-xl font-bold text-acmec-red mb-2">
                No Donation Types Available
              </Text>
              <Text className="text-gray-600 text-center px-6">
                We're currently setting up donation types. Please check back
                later or contact us for more information.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
