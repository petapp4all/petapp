import { View, Text, ScrollView } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FAQs from "@/src/components/FAQs";

const About = () => {
  return (
    <ScrollView className="flex-1 bg-white px-5 py-6">
      {/* Header */}
      <Text className="text-2xl font-bold text-gray-900 mb-4">
        About Splantom PetrolApp
      </Text>

      <Text className="text-base text-gray-700 mb-6">
        Splantom PetrolApp is your go-to solution for real-time fuel price
        updates and nearby petrol station comparisons. Our goal is to provide a
        seamless experience for all fuel consumers.
      </Text>
      {[
        {
          title: "Why Choose Us?",
          icon: "star-circle-outline",
          description:
            "We provide the most reliable and up-to-date petrol pricing and station information.",
        },
        {
          title: "Latest Petrol News",
          icon: "newspaper-variant-outline",
          description:
            "Stay updated with the latest industry trends, government regulations, and fuel price changes.",
        },
        {
          title: "Real-time Price Updates",
          icon: "clock-outline",
          description:
            "Get instant fuel price updates from nearby petrol stations, so you always get the best deals.",
        },

        {
          title: "Nearby Petrol Station Price Comparison",
          icon: "map-marker-radius-outline",
          description:
            "Compare fuel prices at different stations near you and choose the most affordable option.",
        },
      ].map((item, index) => (
        <View
          key={index}
          className="flex-row items-center bg-gray-100 rounded-lg p-4 mb-4"
        >
          <Icon name={item.icon} size={30} color="#FF5722" className="mr-3" />
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900">
              {item.title}
            </Text>
            <Text className="text-sm text-gray-700">{item.description}</Text>
          </View>
        </View>
      ))}

      {/* FAQs Section */}
      <FAQs />
    </ScrollView>
  );
};

export default About;
