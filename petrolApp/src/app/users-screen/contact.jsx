import { View, Text, TouchableOpacity, Linking } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

const Contact = () => {
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
    <View className="flex-1 bg-white p-5">
      <Text className="text-lg font-semibold mb-2">How can we help?</Text>
      <Text className="text-gray-500 mb-5">
        We’re here to help, reach us through any of the following contacts.
        Thank you.
      </Text>

      {/* WhatsApp Contact */}
      <TouchableOpacity
        className="flex-row items-center bg-white border rounded-lg p-4 mb-4 shadow"
        onPress={handleWhatsApp}
      >
        <FontAwesome name="whatsapp" size={30} color="#25D366" />
        <Text className="text-lg flex-1 ml-4">WhatsApp us</Text>
        <MaterialIcons name="open-in-new" size={24} color="gray" />
      </TouchableOpacity>

      {/* Call Contact */}
      <TouchableOpacity
        className="flex-row items-center bg-white border rounded-lg p-4 mb-4 shadow"
        onPress={handleCall}
      >
        <FontAwesome name="phone" size={30} color="gray" />
        <Text className="text-lg flex-1 ml-4">Call us</Text>
        <MaterialIcons name="open-in-new" size={24} color="gray" />
      </TouchableOpacity>

      {/* Email Contact */}
      <TouchableOpacity
        className="flex-row items-center bg-white border rounded-lg p-4 shadow"
        onPress={handleEmail}
      >
        <FontAwesome name="envelope" size={28} color="#EA4335" />
        <Text className="text-lg flex-1 ml-4">Email us</Text>
        <MaterialIcons name="open-in-new" size={24} color="gray" />
      </TouchableOpacity>
    </View>
  );
};

export default Contact;
