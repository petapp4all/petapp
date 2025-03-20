import { View, Text, Image, ScrollView } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons"; // For icons

const SingleStation = () => {
  const { id } = useLocalSearchParams();
  const station = useSelector((state) =>
    state.stations.filteredStations.find((s) => s.id === id)
  );

  if (!station) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-red-500 text-lg font-bold">
          Station not found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="p-5 bg-white">
      {/* Header Section */}
      <View className="items-center mb-6">
        <Image
          source={station.logo}
          className="w-28 h-28 rounded-lg"
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-gray-900 mt-3">
          {station.name}
        </Text>
        <Text className="text-gray-500 text-sm mt-1">
          Last updated {station.lastUpdated}
        </Text>
      </View>

      {/* Station Details */}
      <View className="bg-gray-100 p-4 rounded-lg">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-gray-700 font-semibold">Rating:</Text>
          <View className="flex-row items-center">
            <Text className="text-gray-700">{station.rating}</Text>
            <FontAwesome
              name="star"
              size={16}
              color="#FFD700"
              className="ml-1"
            />
          </View>
        </View>

        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-gray-700 font-semibold">PMS Price:</Text>
          <Text className="text-gray-700">
            {station.pms ? `₦${station.pms} per ltr` : "Not available"}
          </Text>
        </View>

        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-gray-700 font-semibold">AGO Price:</Text>
          <Text className="text-gray-700">
            {station.ago ? `₦${station.ago} per ltr` : "Not available"}
          </Text>
        </View>

        {/* Divider */}
        <View className="border-t border-gray-300 my-4"></View>

        <View className="flex-row items-center mb-3">
          <MaterialIcons name="location-on" size={20} color="gray" />
          <Text className="text-gray-700 ml-2">{station.address}</Text>
        </View>

        <View className="flex-row items-center mb-3">
          <MaterialIcons name="phone" size={20} color="gray" />
          <Text className="text-gray-700 ml-2">{station.contactNumber}</Text>
        </View>

        <View className="flex-row items-center mb-3">
          <MaterialIcons name="email" size={20} color="gray" />
          <Text className="text-gray-700 ml-2">{station.email}</Text>
        </View>

        <View className="flex-row items-center mb-3">
          <MaterialIcons name="access-time" size={20} color="gray" />
          <Text className="text-gray-700 ml-2">{station.operatingHours}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default SingleStation;
