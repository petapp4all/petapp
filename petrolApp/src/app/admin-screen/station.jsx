import React, { useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import Search from "../../components/Search";
import { fetchStations } from "../../redux/slices/stationSlice";

const MarketPlace = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const stations = useSelector((state) => state.stations.filteredStations);
  const loading = useSelector((state) => state.stations.loading);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchStations());
    }, [dispatch])
  );

  const handleStationPress = (id) => {
    router.push({
      pathname: "/admin-screen/SingleStation",
      params: { id },
    });
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-xl">Loading stations...</Text>
      </View>
    );
  }

  return (
    <>
      <Search />
      <View className="p-4 bg-gray-50 pb-14">
        <FlatList
          data={stations}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleStationPress(item.id)}
              className="border border-gray-200 p-4 mb-4 rounded-lg shadow-md bg-white"
            >
              <View className="flex-row items-center mb-3">
                <Image
                  source={
                    item?.image
                      ? { uri: item.image }
                      : require("@/assets/images/gasStation.png")
                  }
                  className="w-20 h-16 rounded-lg mr-3"
                />
                <View>
                  <Text className="font-semibold text-lg text-gray-900">
                    {item.name}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    Last updated: {new Date(item.updatedAt).toLocaleString()}
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
          )}
        />
      </View>
    </>
  );
};

export default MarketPlace;
