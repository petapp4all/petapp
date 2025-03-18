import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Alert,
} from "react-native";
import React, { useEffect } from "react";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import OilGasNews from "@/src/components/OilGasNews";
import { useRouter, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Menu = () => {
  const router = useRouter();

  const segments = useSegments();

  useEffect(() => {
    const backAction = () => {
      // Check if user is at the main dashboard and trying to go back
      if (
        segments.length === 2 &&
        segments[0] === "(user)" &&
        segments[1] === "dashboard"
      ) {
        Alert.alert(
          "Logout",
          "Are you sure you want to logout?",
          [
            {
              text: "No",
              onPress: () => null,
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: async () => {
                await AsyncStorage.removeItem("userDetails");
                router.replace("/sign-in");
              },
            },
          ],
          { cancelable: false }
        );
        return true;
      }

      return false; // Allow normal back navigation
    };

    // Add event listener
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup listener on unmount
  }, [segments]);

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
          <Text className="text-white text-2xl font-bold">₦12,000.00</Text>
        </View>
        <MaterialIcons name="visibility-off" size={28} color="white" />
      </View>

      {/* Order Stats - FIXED */}
      <View className="flex-row justify-between">
        <View className="bg-white p-4 rounded-lg shadow-md flex-1 mr-2 items-center">
          <FontAwesome5 name="shopping-cart" size={24} color="#0072FF" />
          <Text className="text-gray-600 font-semibold">Total Orders</Text>
          <Text className="text-2xl font-bold text-gray-800">10</Text>
        </View>

        <View className="bg-white p-4 rounded-lg shadow-md flex-1 ml-2 items-center">
          <FontAwesome5 name="box" size={24} color="#0072FF" />
          <Text className="text-gray-600 text-center font-semibold">
            Orders Completed
          </Text>
          <Text className="text-2xl font-bold text-gray-800">7</Text>
        </View>
      </View>

      {/* Quick Actions - FIXED */}
      <View className="flex-row justify-between my-4">
        <TouchableOpacity
          onPress={() => router.push("/(user)/marketPlace")}
          className="bg-white p-4 rounded-lg shadow-md flex-1 items-center mr-2"
        >
          <FontAwesome5 name="store" size={24} color="#0072FF" />
          <Text className="text-gray-600 text-center">Market Place</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(user)/nearbyStation")}
          className="bg-white p-4 rounded-lg shadow-md flex-1 items-center mx-2"
        >
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
