import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import OilGasNews from "@/src/components/OilGasNews";

const Menu = () => {
  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      {/* Header Gradient */}
      <LinearGradient
        colors={["#00C6FF", "#0072FF"]}
        className="rounded-xl p-4 mb-4"
      >
        <Text className="text-white text-xl font-semibold">
          Latest Market Price
        </Text>
      </LinearGradient>

      {/* Prices Section */}
      <View className="flex-row justify-between">
        <View className="bg-white p-4 rounded-lg shadow-md flex-1 mr-2">
          <Text className="text-gray-700 font-semibold">PMS</Text>
          <Text className="text-gray-500 text-xs">High Price</Text>
          <Text className="text-xl font-bold text-gray-800">₦985.00</Text>
          <Text className="text-gray-500 text-xs">Best Price</Text>
          <Text className="text-lg font-bold text-green-600">₦831.00</Text>
        </View>

        <View className="bg-white p-4 rounded-lg shadow-md flex-1 ml-2">
          <Text className="text-gray-700 font-semibold">AGO</Text>
          <Text className="text-gray-500 text-xs">High Price</Text>
          <Text className="text-xl font-bold text-gray-800">₦985.00</Text>
          <Text className="text-gray-500 text-xs">Best Price</Text>
          <Text className="text-lg font-bold text-green-600">₦831.00</Text>
        </View>
      </View>

      {/* Amount Spent */}
      <View className="bg-red-600 p-4 rounded-lg my-4 flex-row justify-between items-center shadow-md">
        <View>
          <Text className="text-white text-lg font-semibold">Amount Spent</Text>
          <Text className="text-white text-2xl font-bold">₦0.00</Text>
        </View>
        <MaterialIcons name="visibility-off" size={28} color="white" />
      </View>

      {/* Order Stats - FIXED */}
      <View className="flex-row justify-between">
        <View className="bg-white p-4 rounded-lg shadow-md flex-1 mr-2 items-center">
          <FontAwesome5 name="shopping-cart" size={24} color="#0072FF" />
          <Text className="text-gray-600 font-semibold">Total Orders</Text>
          <Text className="text-2xl font-bold text-gray-800">0</Text>
        </View>

        <View className="bg-white p-4 rounded-lg shadow-md flex-1 ml-2 items-center">
          <FontAwesome5 name="box" size={24} color="#0072FF" />
          <Text className="text-gray-600 font-semibold">Orders Completed</Text>
          <Text className="text-2xl font-bold text-gray-800">0</Text>
        </View>
      </View>

      {/* Quick Actions - FIXED */}
      <View className="flex-row justify-between my-4">
        <TouchableOpacity className="bg-white p-4 rounded-lg shadow-md flex-1 items-center mr-2">
          <FontAwesome5 name="store" size={24} color="#0072FF" />
          <Text className="text-gray-600 text-center">Market Place</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white p-4 rounded-lg shadow-md flex-1 items-center mx-2">
          <FontAwesome5 name="gas-pump" size={24} color="#0072FF" />
          <Text className="text-gray-600 text-center">Nearby Station</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white p-4 rounded-lg shadow-md flex-1 items-center ml-2">
          <FontAwesome5 name="newspaper" size={24} color="#0072FF" />
          <Text className="text-gray-600">News</Text>
        </TouchableOpacity>
      </View>
      {/* Oil & Gas News Section */}
      <View className="my-4">
        <Text className="text-gray-700 text-lg font-semibold mb-2">
          Oil & Gas News
        </Text>
        <OilGasNews />
      </View>
    </ScrollView>
  );
};

export default Menu;
