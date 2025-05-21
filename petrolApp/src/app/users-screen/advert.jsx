import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { getAllAds, markAdsAsSeen } from "../../components/utils/ads";

const Advert = () => {
  const [ads, setAds] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchAds = async () => {
        try {
          setLoading(true);
          const data = await getAllAds();
          setAds(data);
          await markAdsAsSeen();
        } catch (error) {
          console.log("Error:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchAds();
    }, [])
  );
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-xl">Loading ads...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/users-screen/AdvertDetails",
          params: { id: item.id },
        })
      }
    >
      <View className="bg-white p-4 rounded-2xl mb-4 shadow shadow-black/10">
        {/* Image at the top */}
        <Image
          source={
            item?.image
              ? { uri: item.image }
              : require("@/assets/images/ads.jpeg")
          }
          className="w-full h-48 rounded-xl mb-3"
          resizeMode="cover"
        />

        {/* Category */}
        <View className="flex-row items-center mb-1">
          <FontAwesome5 name="tag" size={14} color="#6C63FF" />
          <Text className="ml-2 text-base font-medium text-[#6C63FF] uppercase">
            {item.category}
          </Text>
        </View>

        {/* Title */}
        <Text className="text-xl font-bold text-gray-900 mb-1">
          {item.title}
        </Text>

        {/* Description */}
        <Text className="text-sm text-gray-600 leading-5 mb-3">
          {item.description}
        </Text>

        {/* Footer Details */}
        <View className="border-t border-gray-200 pt-2">
          <View className="flex-row items-center mt-1">
            <FontAwesome5 name="building" size={14} color="#444" />
            <Text className="ml-2 text-sm font-semibold text-gray-700">
              {item.company}
            </Text>
          </View>

          <View className="flex-row items-center mt-1">
            <FontAwesome5 name="calendar-alt" size={14} color="#999" />
            <Text className="ml-2 text-xs text-gray-500">
              Posted on {new Date(item.postedAt).toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#f9f9f9]">
      <FlatList
        data={ads}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />

      <TouchableOpacity
        className="rounded-lg overflow-hidden mt-5 mx-4 mb-3"
        onPress={() => router.push("/users-screen/create-ads")}
      >
        <LinearGradient
          colors={["#00C6FF", "#0072FF"]}
          className="px-6 py-3 rounded-lg"
        >
          <Text className="text-white text-lg text-center font-semibold">
            Create Your Ads
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default Advert;
