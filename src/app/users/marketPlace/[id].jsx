import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const SingleStation = () => {
  const router = useRouter();
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
        {/* Fuel Prices */}
        <Text className="text-lg font-bold text-gray-800 mb-2">
          Fuel Prices
        </Text>
        <Text className="mb-1 text-gray-700">
          PMS: {station.pms ? `₦${station.pms} per ltr` : "Not available"}
        </Text>
        <Text className="mb-4 text-gray-700">
          AGO: {station.ago ? `₦${station.ago} per ltr` : "Not available"}
        </Text>

        {/* Contact Details */}
        <Text className="text-lg font-bold text-gray-800 mb-2">Contact</Text>
        <View className="flex-row items-center mb-2">
          <MaterialIcons name="location-on" size={20} color="gray" />
          <Text className="ml-2 text-gray-700">{station.address}</Text>
        </View>

        <View className="flex-row items-center mb-2">
          <MaterialIcons name="email" size={20} color="gray" />
          <Text className="ml-2 text-gray-700">{station.email}</Text>
        </View>
        <View className="flex-row items-center mb-4">
          <MaterialIcons name="access-time" size={20} color="gray" />
          <Text className="ml-2 text-gray-700">{station.operatingHours}</Text>
        </View>

        {/* Additional Info */}
        <Text className="text-lg font-bold text-gray-800 mb-2">
          Station Info
        </Text>
        <Text className="text-gray-700 mb-1">
          Available Products: {station.availableProducts.join(", ")}
        </Text>

        <Text className="text-gray-700 mb-1">
          Payment Methods: {station.paymentMethods.join(", ")}
        </Text>
        <Text className="text-gray-700 mb-1">
          Facilities: {station.facilities.join(", ")}
        </Text>
        <Text className="text-gray-700 mb-1">
          Station Type: {station.stationType}
        </Text>
        <Text className="text-gray-700 mb-1">
          Ordering Supported:{" "}
          {station.supportedOrdering === "yes" ? "Yes" : "No"}
        </Text>

        <TouchableOpacity
          style={{
            marginTop: 16,
            marginBottom: 16,
            backgroundColor: "#2563eb", // blue
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 10,
            alignItems: "center",
          }}
          onPress={() =>
            router.push({
              pathname: "/users-screen/place-order",
              params: {
                stationId: station.id,
                stationName: station.name,
                pms: station.pms,
                ago: station.ago,
                address: station.address,
                logo: station.logo, // optional
              },
            })
          }
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Interested In Buying
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SingleStation;
