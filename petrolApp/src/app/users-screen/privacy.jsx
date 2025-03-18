import { View, Text, ScrollView } from "react-native";
import React from "react";

const PrivacyPolicy = () => {
  return (
    <ScrollView className="flex-1 bg-white px-5 py-6">
      <Text className="text-2xl font-bold text-gray-900 mb-3">
        Our Privacy Policy
      </Text>

      <Text className="text-base text-gray-700 mb-4">
        At Splantom PetrolApp, we are committed to protecting your privacy. This
        Privacy Policy outlines how we collect, use, and protect your
        information.
      </Text>

      <Text className="texts-xl font-bold text-gray-900 mb-2">
        1. Information We Collect
      </Text>

      <Text className="text-base text-gray-700 mb-2">
        We collect the following information from users:
      </Text>

      <View className="ml-4">
        {[
          "Name",
          "Phone number",
          "Email address",
          "State and zone",
          "Profile photos",
          "Delivery address",
        ].map((item, index) => (
          <Text key={index} className="text-base text-gray-700 mb-1">
            • {item}
          </Text>
        ))}
      </View>

      <Text className="text-xl font-bold text-gray-900 mt-6 mb-2">
        2. How We Use Your Information
      </Text>

      <Text className="text-base text-gray-700 mb-2">
        We use the information we collect in the following ways:
      </Text>

      <View className="ml-4">
        {[
          "To provide and maintain our service",
          "To notify you about changes to our service",
          "To allow you to participate in interactive features of our service",
          "To provide customer support",
        ].map((item, index) => (
          <Text key={index} className="text-base text-gray-700 mb-1">
            • {item}
          </Text>
        ))}
      </View>

      <Text className="text-xl font-bold text-gray-900 mt-6 mb-2">
        Contact Us
      </Text>

      <Text className="text-base text-gray-700 mb-2">
        If you have any questions about this policy, please contact us at:
      </Text>

      <Text className="text-base font-bold text-blue-600">
        splantom@gmail.com
      </Text>
    </ScrollView>
  );
};

export default PrivacyPolicy;
