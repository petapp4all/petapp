import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import {
  getAllAds,
  markAdsAsSeen,
  postPricing,
} from "../../../components/utils/ads";

const Advert = () => {
  const [ads, setAds] = useState([]);
  const router = useRouter();
  const [amount, setAmount] = useState(10000);
  const [duration, setDuration] = useState("1w");
  const [isPosting, setIsPosting] = useState(false);
  const [showPriceUpdater, setShowPriceUpdater] = useState(false);

  const handleUpdatePrice = async () => {
    setIsPosting(true);
    try {
      await postPricing(duration, amount);
      Alert.alert("Success", "Price updated successfully!");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update price");
    } finally {
      setIsPosting(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchAds = async () => {
        try {
          const data = await getAllAds();
          setAds(data);
          await markAdsAsSeen();
        } catch (error) {
          console.log("Error:", error);
        }
      };
      fetchAds();
    }, [])
  );
  console.log("ads=", ads);
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => router.push(`/admin/ads/${item.id}`)}>
      <View className="bg-white p-4 rounded-2xl mb-4 shadow shadow-black/10">
        {/* Image at the top */}
        <Image
          source={
            item?.image
              ? { uri: item.image }
              : require("@/assets/images/ads.jpeg")
          }
          className="w-full h-48 rounded-xl mb-3"
          resizeMode="cover"
        />

        {/* Category */}
        <View className="flex-row items-center mb-1">
          <FontAwesome5 name="tag" size={14} color="#6C63FF" />
          <Text className="ml-2 text-base font-medium text-[#6C63FF] uppercase">
            {item.category}
          </Text>
        </View>

        {/* Title */}
        <Text className="text-xl font-bold text-gray-900 mb-1">
          {item.title}
        </Text>

        {/* Description */}
        <Text className="text-sm text-gray-600 leading-5 mb-3">
          {item.description}
        </Text>

        {/* Footer Details */}
        <View className="border-t border-gray-200 pt-2">
          <View className="flex-row items-center mt-1">
            <FontAwesome5 name="building" size={14} color="#444" />
            <Text className="ml-2 text-sm font-semibold text-gray-700">
              {item.company}
            </Text>
          </View>

          <View className="flex-row items-center mt-1">
            <FontAwesome5 name="calendar-alt" size={14} color="#999" />
            <Text className="ml-2 text-xs text-gray-500">
              Posted on {new Date(item.postedAt).toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const formatWithCommas = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString();
  };
  return (
    <View className="flex-1 bg-[#f9f9f9]">
      <TouchableOpacity
        className="mx-4 mt-4 mb-2"
        onPress={() => setShowPriceUpdater((prev) => !prev)}
      >
        <Text className="text-blue-600 font-medium text-base">
          {showPriceUpdater ? "Hide Price Updater" : "Update Pricing"}
        </Text>
      </TouchableOpacity>

      {showPriceUpdater && (
        <View className="bg-white mb-16 rounded-2xl p-4 shadow-md">
          <Text className="text-xl font-semibold mb-4 text-gray-800">
            Update amount
          </Text>

          <Text className="text-base text-gray-700 mb-1">Amount</Text>
          <TextInput
            value={formatWithCommas(amount)}
            onChangeText={(val) => {
              const numericVal = val.replace(/,/g, "").replace(/[^0-9]/g, "");
              setAmount(Number(numericVal));
            }}
            keyboardType="numeric"
            placeholder="Enter amount"
            className="border border-gray-300 rounded px-3 py-2 mb-4 text-base text-gray-800"
          />

          <Text className="text-base text-gray-700 mb-1">Duration</Text>
          <View className="border border-gray-300 rounded mb-4">
            <Picker
              selectedValue={duration}
              onValueChange={(val) => setDuration(val)}
            >
              <Picker.Item label="1 week" value="1w" />
              <Picker.Item label="2 weeks" value="2w" />
              <Picker.Item label="1 month" value="1m" />
            </Picker>
          </View>

          <TouchableOpacity
            className={`bg-green-600 py-3 rounded-lg items-center ${
              isPosting ? "opacity-70" : ""
            }`}
            onPress={handleUpdatePrice}
            disabled={isPosting}
          >
            {isPosting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                Update price
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={ads}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />

      <TouchableOpacity
        className="rounded-lg overflow-hidden mt-5 mx-2"
        onPress={() => router.push("/users-screen/create-ads")}
      >
        <LinearGradient
          colors={["#00C6FF", "#0072FF"]}
          className="px-6 py-3 rounded-lg"
        >
          <Text className="text-white text-lg text-center font-semibold">
            Create Your Ads
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default Advert;
