import React, { useState } from "react";
import { View, Text, FlatList } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const CompletedOrders = () => {
  const [completedOrders, setCompletedOrders] = useState([
    {
      id: "5",
      customerName: "Aisha Bello",
      fuelType: "Gasoline",
      quantity: "450L",
      price: "₦180,000",
      paymentStatus: "Paid",
      location: "5 Wuse Market Road, Abuja, Nigeria",
      deliveryDate: "2025-03-23",
      status: "Approved",
    },
    {
      id: "6",
      customerName: "Emmanuel Osei",
      fuelType: "LPG",
      quantity: "600L",
      price: "₦240,000",
      paymentStatus: "Paid",
      location: "78 Ring Road, Ibadan, Nigeria",
      deliveryDate: "2025-03-18",
      status: "Approved",
    },
    {
      id: "7",
      customerName: "Chinedu Okeke",
      fuelType: "Diesel",
      quantity: "700L",
      price: "₦350,000",
      paymentStatus: "Paid",
      location: "14 Marina Street, Lagos, Nigeria",
      deliveryDate: "2025-03-20",
      status: "Approved",
    },
  ]);

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-4 text-green-600">
        Completed Orders
      </Text>

      <FlatList
        data={completedOrders}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="bg-white p-4 mb-3 rounded-lg shadow-md border-l-4 border-green-600">
            <View className="flex-row items-center mb-2">
              <FontAwesome5 name="check-circle" size={24} color="green" />
              <Text className="text-lg font-bold ml-2">{item.fuelType}</Text>
            </View>

            <Text className="text-gray-800 font-semibold">
              Customer:{" "}
              <Text className="text-gray-600">{item.customerName}</Text>
            </Text>
            <Text className="text-gray-800 font-semibold">
              Location: <Text className="text-gray-600">{item.location}</Text>
            </Text>
            <Text className="text-gray-800 font-semibold">
              Quantity: <Text className="text-gray-600">{item.quantity}</Text>
            </Text>
            <Text className="text-gray-800 font-semibold">
              Price: <Text className="text-gray-600">{item.price}</Text>
            </Text>
            <Text className="text-gray-800 font-semibold">
              Payment Status:{" "}
              <Text className="text-gray-600">{item.paymentStatus}</Text>
            </Text>
            <Text className="text-gray-800 font-semibold">
              Delivery Date:{" "}
              <Text className="text-gray-600">{item.deliveryDate}</Text>
            </Text>
            <Text className="text-green-600 font-bold mt-2">
              Status: {item.status}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-600">No completed orders</Text>
        }
      />
    </View>
  );
};

export default CompletedOrders;
