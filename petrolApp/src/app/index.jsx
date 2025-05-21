import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const WelcomeScreen = () => {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("@/assets/images/futuristic_petrol_station.png")}
      className="flex-1 justify-center items-center"
      resizeMode="cover"
    >
      <View className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-20" />
      <View className="w-full p-6">
        {/* Title */}
        <Text className="text-blue-500 text-4xl font-bold text-center mb-6 shadow-md">
          Welcome to Splantom Petrol App
        </Text>
        <Text className="text-white text-2xl text-center mb-5">
          Your one-stop solution to locate nearby petrol stations, compare fuel
          prices, and make secure payments with ease.
        </Text>
        <Text className="text-white text-2xl text-center">
          Join us on the journey to smarter, faster, and more rewarding fueling
          experiences.
        </Text>

        <TouchableOpacity
          className="rounded-lg overflow-hidden mt-5"
          onPress={() => router.push("/sign-in")}
        >
          <LinearGradient
            colors={["#00C6FF", "#0072FF"]}
            className="px-6 py-3 rounded-lg"
          >
            <Text className="text-white text-lg text-center font-semibold">
              Get Started
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default WelcomeScreen;
