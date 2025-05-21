import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  getUserById,
  sendEmailToUser,
  sendNotificationToUser,
} from "../../components/utils/users";
import { createOrder } from "../../components/utils/ads";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

const PlaceOrder = () => {
  const { stationEmail, ownerId, stationName, pms, ago } =
    useLocalSearchParams();
  const [fuelType, setFuelType] = useState("pms");
  const [litres, setLitres] = useState("");
  const [address, setAddress] = useState("");
  const [expectedDateTime, setExpectedDateTime] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [user, setUser] = useState(null);

  const pricePerLitre = fuelType === "pms" ? Number(pms) : Number(ago);
  const total = litres ? (Number(litres) * pricePerLitre).toFixed(2) : 0;

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem("userDetails");
      const parsedUser = JSON.parse(userData);
      const fetchedUser = await getUserById(parsedUser.id);
      if (fetchedUser) {
        setUser(fetchedUser);
        setAddress(fetchedUser.address || "");
      }
    };
    fetchUser();
  }, []);

  const handlePlaceOrder = async () => {
    if (!litres || !address) {
      Alert.alert("Incomplete", "Please enter litres and address.");
      return;
    }

    try {
      setIsSubmitting(true);
      const orderDetails = {
        fuelType: fuelType.toUpperCase(),
        litres,
        address,
        total: Number(total),
        userId: user?.id,
        userName: user?.name || "Unknown User",
        userPhone: user?.phone || "N/A",
        stationName,
        stationEmail,
        ownerId,
        expectedDateTime,
      };

      await createOrder(orderDetails);

      const message = `${orderDetails.userName} (Phone: ${
        orderDetails.userPhone
      }) placed an order for ${orderDetails.litres} litres of ${
        orderDetails.fuelType
      } to be delivered at "${
        orderDetails.address
      }". Expected date: ${expectedDateTime.toLocaleString()}. Total: ₦${Number(
        total
      ).toLocaleString()}.`;

      await sendNotificationToUser({
        recipientId: ownerId,
        title: "New Fuel Order",
        body: message,
        data: {
          screen: "/users-screen/orders",
        },
      });
      await sendNotificationToUser({
        recipientId: "67f3b1f366d08411e76d346f",
        title: "New Fuel Order",
        body: message,
        data: {
          screen: "/admin-screen/orders",
        },
      });

      await sendEmailToUser({
        email: stationEmail,
        subject: "New Fuel Order Notification",
        message,
      });
      await sendEmailToUser({
        email: "uchedprogrammer@gmail.com",
        subject: "New Fuel Order Notification",
        message,
      });
      setLitres("");
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Order Sent",
        `Your fuel order request has been sent to ${stationName}. The station has been notified and will respond shortly.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(expectedDateTime);
      newDate.setFullYear(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      setExpectedDateTime(newDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(expectedDateTime);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setExpectedDateTime(newDate);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white p-5"
      keyboardShouldPersistTaps="handled"
    >
      <Text className="text-2xl font-bold mb-5">{stationName}</Text>

      <Text className="text-base text-gray-700 mb-1">Select Fuel Type</Text>
      <View className="border border-gray-300 rounded-md mb-4">
        <Picker
          selectedValue={fuelType}
          onValueChange={(value) => setFuelType(value)}
        >
          {pms && <Picker.Item label={`PMS (₦${pms})`} value="pms" />}
          {ago && <Picker.Item label={`AGO (₦${ago})`} value="ago" />}
        </Picker>
      </View>

      <Text className="text-base text-gray-700 mb-1">Enter Litres</Text>
      <TextInput
        className="border border-gray-300 rounded-md px-4 py-4 mb-4"
        placeholder="e.g. 10"
        keyboardType="numeric"
        value={litres}
        onChangeText={setLitres}
      />

      <Text className="text-base text-gray-700 mb-1">Delivery Address</Text>
      <TextInput
        className="border border-gray-300 rounded-md px-4 py-4 mb-4"
        placeholder="Enter delivery address"
        value={address}
        onChangeText={setAddress}
        multiline
      />

      <Text className="text-lg font-semibold text-gray-800 mb-6">
        Total: ₦{Number(total).toLocaleString()}
      </Text>

      <Text className="text-base text-gray-700 mb-1">
        Expected Delivery Date & Time
      </Text>

      <TouchableOpacity
        className="border border-gray-300 rounded-md px-4 py-4 mb-2"
        onPress={() => setShowDatePicker(true)}
      >
        <Text>{expectedDateTime.toDateString()}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="border border-gray-300 rounded-md px-4 py-4 mb-4"
        onPress={() => setShowTimePicker(true)}
      >
        <Text>{expectedDateTime.toLocaleTimeString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={expectedDateTime}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={expectedDateTime}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleTimeChange}
        />
      )}

      <TouchableOpacity
        className="bg-blue-600 py-3 rounded-xl mb-10 flex-row justify-center items-center"
        onPress={handlePlaceOrder}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className="text-center text-white font-bold text-base">
            Place Order
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PlaceOrder;
