import { View, Text, FlatList, Image } from "react-native";
import React from "react";

const stations = [
  {
    id: "1",
    name: "Menj Oil (Lagos)",
    logo: require("@/assets/images/menj-oil-logo.jpeg"),
    lastUpdated: "6 hours ago",
    sales: 0,
    rating: 0.0,
    pms: 830,
    ago: 1028,
  },
  {
    id: "2",
    name: "Matrix Energy (Warri)",
    logo: require("@/assets/images/matrix-energy-logo.png"),
    lastUpdated: "1 hour ago",
    sales: 0,
    rating: 0.0,
    pms: 857,
    ago: null,
  },
  {
    id: "3",
    name: "Africa Terminals Nig. Ltd. (Lagos)",
    logo: require("@/assets/images/africa-terminals-logo.png"),
    lastUpdated: "7 hours ago",
    sales: 0,
    rating: 0.0,
    pms: null,
    ago: 1033,
  },
];

const MarketPlace = () => {
  return (
    <View className="p-4 bg-white">
      <Text className="text-center text-lg font-bold mb-4">MarketPlace</Text>

      <FlatList
        data={stations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="border p-4 mb-3 rounded-lg shadow bg-gray-100">
            {/* Logo & Station Name */}
            <View className="flex-row items-center mb-2">
              <Image source={item.logo} className="w-10 h-10 mr-2" />
              <View>
                <Text className="font-bold text-lg">{item.name}</Text>
                <Text className="text-gray-500 text-xs">
                  Last updated {item.lastUpdated}
                </Text>
              </View>
            </View>

            {/* Fuel Prices */}
            <View className="border-t pt-2">
              <Text className="text-gray-700">
                <Text className="font-bold">PMS:</Text>{" "}
                {item.pms ? `₦${item.pms} per ltr` : "Not available"}
              </Text>
              <Text className="text-gray-700">
                <Text className="font-bold">AGO:</Text>{" "}
                {item.ago ? `₦${item.ago} per ltr` : "Not available"}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default MarketPlace;
