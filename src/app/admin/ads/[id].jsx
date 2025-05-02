import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { deleteAd, getSingleAd } from "../../../components/utils/ads";

const AdvertDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = () => {
    Alert.alert(
      "Delete Advert",
      "Are you sure you want to delete this advert?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              setIsDeleting(true);
              await deleteAd(id);
              Alert.alert("Deleted", "Advert removed successfully.");
              router.back();
            } catch (error) {
              Alert.alert("Error", "Failed to delete advert.");
            } finally {
              setIsDeleting(false);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  if (loading) {
    return (
      <ActivityIndicator className="flex-1 mt-20" size="large" color="#f00" />
    );
  }

  return (
    <ScrollView className="bg-white p-4">
      <Text className="text-3xl font-extrabold text-red-600 mb-6 text-center">
        📣 Advert Details
      </Text>

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

      <TouchableOpacity
        className="bg-red-600 p-4 rounded-xl mb-7 flex-row items-center justify-center"
        onPress={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-lg font-bold text-center">
            🗑️ Delete Advert
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AdvertDetails;
