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
import ImageSlider from "../../../components/ImageSlider";

const Menu = () => {
  const router = useRouter();

  const segments = useSegments();

  useEffect(() => {
    const backAction = () => {
      // Check if user is at the main dashboard and trying to go back
      if (
        segments.length === 2 &&
        segments[0] === "users" &&
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

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userDetails = await AsyncStorage.getItem("userDetails");
        if (!userDetails) {
          router.replace("/sign-in");
        }
      } catch (error) {
        console.log("Error checking login status:", error);
        router.replace("/sign-in");
      }
    };
    checkLoginStatus();
  }, []);

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      {/* Header Gradient */}
      <ImageSlider />
      <LinearGradient
        colors={["#00C6FF", "#0072FF"]}
        className="rounded-xl p-4 mb-4 mt-5"
      >
        <Text className="text-white text-xl font-semibold">
          Latest Market Price
        </Text>
      </LinearGradient>

      {/* Prices Section */}
      <View className="bg-white p-4 rounded-2xl shadow-lg flex-1 mr-2">
        <View className="flex flex-row justify-between items-start mb-4">
          <Text className="text-gray-700 text-lg font-semibold">PMS</Text>
        </View>

        <View className="flex flex-row justify-between items-center mb-2">
          <Text className="text-gray-500 text-sm">High Price</Text>
          <Text className="text-xl font-bold text-gray-800">₦950.00</Text>
        </View>

        <View className="flex flex-row justify-between items-center">
          <Text className="text-gray-500 text-sm">Best Price</Text>
          <Text className="text-xl font-bold text-green-600">₦835.00</Text>
        </View>
      </View>

      {/* Quick Actions - FIXED */}
      <View className="flex-row justify-between my-4">
        <TouchableOpacity
          onPress={() => router.push("/users/nearbyStation")}
          className="bg-white p-4 rounded-lg shadow-md flex-1 items-center mx-2"
        >
          <FontAwesome5 name="gas-pump" size={24} color="#0072FF" />
          <Text className="text-gray-600 text-center">Nearby Station</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/users/marketPlace")}
          className="bg-white p-4 rounded-lg shadow-md flex-1 items-center ml-2"
        >
          <FontAwesome5 name="store" size={24} color="#0072FF" />
          <Text className="text-gray-600 text-center">Market Place</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/users/news")}
          className="bg-white p-4 rounded-lg shadow-md flex-1 items-center ml-2"
        >
          <FontAwesome5 name="newspaper" size={24} color="#0072FF" />
          <Text className="text-gray-600 text-center">Latest News</Text>
        </TouchableOpacity>
      </View>
      {/* Oil & Gas News Section */}
      <View className="my-1 ">
        <OilGasNews />
      </View>
    </ScrollView>
  );
};

export default Menu;
