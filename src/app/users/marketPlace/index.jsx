import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Link, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import Search from "../../../components/Search";

const MarketPlace = () => {
  const stations = useSelector((state) => state.stations.filteredStations);

  const router = useRouter();
  return (
    <>
      <Search />
      <View className="p-4 bg-gray-50 pb-14">
        <FlatList
          data={stations}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Link href={`/users/marketPlace/${item.id}`} asChild>
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
    </>
  );
};

export default MarketPlace;
