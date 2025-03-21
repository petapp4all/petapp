import { View, Text, TouchableOpacity, Linking } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

const Contact = () => {
  const phoneNumber = "08109774285";

  const handleWhatsApp = () => {
    const url = `https://wa.me/234${phoneNumber.slice(1)}`;
    Linking.openURL(url).catch(() => alert("Failed to open WhatsApp"));
  };

  const handleCall = () => {
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch(() => alert("Failed to make a call"));
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
        <FontAwesome
          name="whatsapp"
          size={30}
          color="#25D366"
          className="mr-3"
        />
        <Text className="text-lg flex-1">WhatsApp us</Text>
        <MaterialIcons name="open-in-new" size={24} color="gray" />
      </TouchableOpacity>

      {/* Call Contact */}
      <TouchableOpacity
        className="flex-row items-center bg-white border rounded-lg p-4 shadow"
        onPress={handleCall}
      >
        <FontAwesome name="phone" size={30} color="gray" className="mr-3" />
        <Text className="text-lg flex-1">Call us</Text>
        <MaterialIcons name="open-in-new" size={24} color="gray" />
      </TouchableOpacity>
    </View>
  );
};

export default Contact;
