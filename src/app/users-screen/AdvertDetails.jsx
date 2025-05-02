import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { getSingleAd } from "../../components/utils/ads";

const AdvertDetails = () => {
  const { id } = useLocalSearchParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const data = await getSingleAd(id);
        setAd(data);
      } catch (err) {
        console.log("Failed to fetch advert");
      } finally {
        setLoading(false);
      }
    };
    fetchAd();
  }, [id]);

  if (loading) {
    return (
      <ActivityIndicator className="flex-1 mt-20" size="large" color="#f00" />
    );
  }

  return (
    <ScrollView className="bg-white p-4">
      <View className="bg-gray-100 p-4 rounded-xl mb-4 shadow">
        <Text className="text-lg font-semibold mb-1">📝 Title</Text>
        <Text className="text-base text-gray-700">{ad?.title}</Text>
      </View>

      <View className="bg-gray-100 p-4 rounded-xl mb-4 shadow">
        <Text className="text-lg font-semibold mb-1">📂 Category</Text>
        <Text className="text-base text-gray-700">{ad?.category}</Text>
      </View>

      <View className="bg-gray-100 p-4 rounded-xl mb-4 shadow">
        <Text className="text-lg font-semibold mb-1">🧾 Description</Text>
        <Text className="text-base text-gray-700">{ad?.description}</Text>
      </View>

      <View className="bg-gray-100 p-4 rounded-xl mb-4 shadow">
        <Text className="text-lg font-semibold mb-1">🏢 Company</Text>
        <Text className="text-base text-gray-700">{ad?.company}</Text>
      </View>

      <View className="bg-gray-100 p-4 rounded-xl mb-6 shadow">
        <Text className="text-lg font-semibold mb-1">📅 Posted At</Text>
        <Text className="text-base text-gray-700">
          {new Date(ad?.postedAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Text>
      </View>

      <Text className="text-2xl font-bold text-gray-800 mb-3 text-center">
        👤 Contact Information
      </Text>

      <View className="bg-gray-100 p-4 rounded-xl mb-4 shadow">
        <Text className="text-lg font-semibold mb-1">🧑 Name</Text>
        <Text className="text-base text-gray-700">{ad?.user?.name}</Text>
      </View>

      <View className="bg-gray-100 p-4 rounded-xl mb-4 shadow">
        <Text className="text-lg font-semibold mb-1">✉️ Email</Text>
        <Text className="text-base text-gray-700">{ad?.user?.email}</Text>
      </View>

      <View className="bg-gray-100 p-4 rounded-xl mb-4 shadow">
        <Text className="text-lg font-semibold mb-1">📞 Phone</Text>
        <Text className="text-base text-gray-700">{ad?.user?.phone}</Text>
      </View>

      <View className="bg-gray-100 p-4 rounded-xl mb-6 shadow">
        <Text className="text-lg font-semibold mb-1">🌍 Country</Text>
        <Text className="text-base text-gray-700">{ad?.user?.country}</Text>
      </View>
    </ScrollView>
  );
};

export default AdvertDetails;
