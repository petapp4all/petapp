import { View } from "react-native";
import React from "react";

export const Card = ({ children, style }) => {
  return (
    <View className={`bg-white p-4 rounded-lg shadow-md ${style}`}>
      {children}
    </View>
  );
};
