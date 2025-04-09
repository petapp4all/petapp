import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import React from "react";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

const PrivacyPolicy = () => {
  const phoneNumber = "07032429235";
  const emailAddress = "petapp4all@gmail.com";

  const handleWhatsApp = () => {
    const url = `https://wa.me/234${phoneNumber.slice(1)}`;
    Linking.openURL(url).catch(() => alert("Failed to open WhatsApp"));
  };

  const handleCall = () => {
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch(() => alert("Failed to make a call"));
  };

  const handleEmail = () => {
    const url = `mailto:${emailAddress}`;
    Linking.openURL(url).catch(() => alert("Failed to open email client"));
  };

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
          // "Delivery address",
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

      {/* WhatsApp Contact */}
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 12,
          marginBottom: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 3,
        }}
        onPress={handleWhatsApp}
      >
        <FontAwesome name="whatsapp" size={30} color="#25D366" />
        <Text style={{ fontSize: 18, marginLeft: 15, flex: 1 }}>
          WhatsApp us
        </Text>
        <MaterialIcons name="open-in-new" size={24} color="gray" />
      </TouchableOpacity>

      {/* Call Contact */}
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 12,
          marginBottom: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 3,
        }}
        onPress={handleCall}
      >
        <FontAwesome name="phone" size={30} color="gray" />
        <Text style={{ fontSize: 18, marginLeft: 15, flex: 1 }}>Call us</Text>
        <MaterialIcons name="open-in-new" size={24} color="gray" />
      </TouchableOpacity>
      {/* Email Contact */}
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 12,
          marginBottom: 40,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 3,
        }}
        onPress={handleEmail}
      >
        <FontAwesome name="envelope" size={28} color="#EA4335" />
        <Text className="text-lg flex-1 ml-4">Email us</Text>
        <MaterialIcons name="open-in-new" size={24} color="gray" />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PrivacyPolicy;
