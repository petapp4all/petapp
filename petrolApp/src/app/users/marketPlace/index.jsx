import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Link } from "expo-router";

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
  {
    id: "4",
    name: "TotalEnergies (Abuja)",
    logo: require("@/assets/images/total-logo.jpeg"),
    lastUpdated: "3 hours ago",
    sales: 0,
    rating: 0.0,
    pms: 850,
    ago: 1040,
  },
  {
    id: "5",
    name: "Oando Plc (Lagos)",
    logo: require("@/assets/images/oando-logo.png"),
    lastUpdated: "5 hours ago",
    sales: 0,
    rating: 0.0,
    pms: 845,
    ago: null,
  },
  {
    id: "6",
    name: "Conoil (Port Harcourt)",
    logo: require("@/assets/images/conoil-logo.png"),
    lastUpdated: "2 hours ago",
    sales: 0,
    rating: 0.0,
    pms: 860,
    ago: 1050,
  },
  {
    id: "7",
    name: "MRS Oil (Ibadan)",
    logo: require("@/assets/images/mrs-logo.png"),
    lastUpdated: "1 hour ago",
    sales: 0,
    rating: 0.0,
    pms: 840,
    ago: null,
  },
  {
    id: "8",
    name: "Eterna Plc (Kano)",
    logo: require("@/assets/images/eterna-logo.png"),
    lastUpdated: "4 hours ago",
    sales: 0,
    rating: 0.0,
    pms: 855,
    ago: 1025,
  },
];

const MarketPlace = () => {
  return (
    <View className="p-4 bg-gray-50 ">
      <FlatList
        data={stations}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Link href={`/marketPlace/${item.id}`} asChild>
            <TouchableOpacity className="border border-gray-200 p-4 mb-4 rounded-lg shadow-md bg-white">
              <View className="flex-row items-center mb-3">
                <Image
                  source={item.logo}
                  className="w-16 h-16 rounded-full mr-3"
                />
                <View>
                  <Text className="font-semibold text-lg text-gray-900">
                    {item.name}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    Last updated {item.lastUpdated}
                  </Text>
                </View>
              </View>
              <View className="border-t border-gray-200 pt-3 flex-row justify-between">
                <Text className="text-gray-700 font-medium">PMS:</Text>
                <Text className="text-gray-700">
                  {item.pms ? `₦${item.pms} per ltr` : "Not available"}
                </Text>
              </View>
              <View className="mt-2 flex-row justify-between">
                <Text className="text-gray-700 font-medium">AGO:</Text>
                <Text className="text-gray-700">
                  {item.ago ? `₦${item.ago} per ltr` : "Not available"}
                </Text>
              </View>
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  );
};

export default MarketPlace;
