import { View, Text } from "react-native";
import React from "react";

const nearbyStation = () => {
  return (
    <View className="h-screen bg-blue-600 items-center justify-center">
      <Text className="text-white text-3xl font-bold">
        See All Nearby Station
      </Text>
      <Text className="text-white text-2xl font-bold">
        Price and other info
      </Text>
    </View>
  );
};

export default nearbyStation;
