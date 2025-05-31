import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router"; // ← add useRouter
import { MaterialIcons } from "@expo/vector-icons";
import {
  getStationDetails,
  deleteStation,
} from "../../components/utils/station";

const SingleStation = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter(); // ← router for navigation
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStation = async () => {
      try {
        setLoading(true);
        const data = await getStationDetails(id);
        setStation(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStation();
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      "Delete Station",
      "Are you sure you want to delete this station?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await deleteStation(id);
              Alert.alert("Success", "Station deleted successfully.");
              router.back(); // ← navigate back
            } catch (error) {
              Alert.alert("Error", "Failed to delete station.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!station) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-red-500 text-lg font-bold">
          Station not found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="p-5 bg-white">
      {/* Header Section */}
      <View className="items-center mb-6">
        <Image
          source={
            station?.image
              ? { uri: station.image }
              : require("@/assets/images/gasStation.png")
          }
          className="w-36 h-36 rounded-lg"
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-gray-900 mt-3">
          {station.name}
        </Text>
        <Text className="text-gray-500 text-sm mt-1">
          Last updated: {new Date(station.updatedAt).toLocaleString()}
        </Text>
      </View>

      {/* Station Details */}
      <View className="bg-gray-100 p-4 rounded-lg">
        <Text className="text-lg font-bold text-gray-800 mb-2">
          Fuel Prices
        </Text>
        <Text className="mb-1 text-gray-700">
          PMS: {station.pms ? `₦${station.pms} per ltr` : "Not available"}
        </Text>
        <Text className="mb-4 text-gray-700">
          AGO: {station.ago ? `₦${station.ago} per ltr` : "Not available"}
        </Text>

        <Text className="text-lg font-bold text-gray-800 mb-2">Contact</Text>
        <View className="flex-row items-center mb-2">
          <MaterialIcons name="location-on" size={20} color="gray" />
          <Text className="ml-2 text-gray-700">{station.address}</Text>
        </View>
        <View className="flex-row items-center mb-2">
          <MaterialIcons name="email" size={20} color="gray" />
          <Text className="ml-2 text-gray-700">{station.email}</Text>
        </View>
        <View className="flex-row items-center mb-4">
          <MaterialIcons name="access-time" size={20} color="gray" />
          <Text className="ml-2 text-gray-700">{station.operatingHours}</Text>
        </View>

        <Text className="text-lg font-bold text-gray-800 mb-2">
          Station Info
        </Text>
        <Text className="text-gray-700 mb-1">
          Available Products: {station.availableProducts.join(", ")}
        </Text>
        <Text className="text-gray-700 mb-1">
          Payment Methods: {station.paymentMethods.join(", ")}
        </Text>
        <Text className="text-gray-700 mb-1">
          Facilities: {station.facilities.join(", ")}
        </Text>
        <Text className="text-gray-700 mb-4">
          Ordering Supported: {station.supportedOrdering ? "Yes" : "No"}
        </Text>

        {/* Owner Info */}
        <Text className="text-lg font-bold text-gray-800 mb-2">Owner Info</Text>
        <Text className="text-gray-700 mb-1">Name: {station.owner.name}</Text>
        <Text className="text-gray-700 mb-1">Email: {station.owner.email}</Text>
        <Text className="text-gray-700 mb-1">Phone: {station.owner.phone}</Text>
        <Text className="text-gray-700 mb-4">
          Country: {station.owner.country}
        </Text>

        {/* Delete Button */}
        <TouchableOpacity
          className="bg-red-600 px-4 py-3 rounded-lg mt-4 items-center mb-14"
          onPress={handleDelete}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Delete Station
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SingleStation;
