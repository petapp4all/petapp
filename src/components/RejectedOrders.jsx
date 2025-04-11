import React, { useState } from "react";
import { View, Text, FlatList } from "react-native";

const getRandomTime = () => {
  const hours = Math.floor(Math.random() * 12) + 1; // 1 to 12
  const minutes = Math.floor(Math.random() * 60); // 0 to 59
  const period = Math.random() > 0.5 ? "AM" : "PM"; // Randomly AM or PM
  return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${period}`;
};

const RejectedOrders = () => {
  const [orders] = useState([
    {
      id: "10",
      customerName: "Ibrahim Lawal",
      fuelType: "Diesel",
      quantity: "1200L",
      price: "₦600,000",
      paymentStatus: "Pending",
      location: "50 Airport Road, Kano, Nigeria",
      deliveryDate: "2025-03-27",
      status: "Pending",
      time: getRandomTime(),
    },
    {
      id: "11",
      customerName: "Grace Obinna",
      fuelType: "Petrol",
      quantity: "800L",
      price: "₦400,000",
      paymentStatus: "Paid",
      location: "18 Ikot Ekpene Road, Calabar, Nigeria",
      deliveryDate: "2025-03-28",
      status: "Rejected",
      time: getRandomTime(),
    },
    {
      id: "12",
      customerName: "Michael Eze",
      fuelType: "Kerosene",
      quantity: "250L",
      price: "₦100,000",
      paymentStatus: "Pending",
      location: "22 Niger Street, Onitsha, Nigeria",
      deliveryDate: "2025-03-29",
      status: "Cancelled",
      time: getRandomTime(),
    },
    {
      id: "13",
      customerName: "Aisha Bello",
      fuelType: "Diesel",
      quantity: "600L",
      price: "₦300,000",
      paymentStatus: "Paid",
      location: "33 Sapele Road, Benin City, Nigeria",
      deliveryDate: "2025-03-30",
      status: "Cancelled",
      time: getRandomTime(),
    },
  ]);

  // Filter orders that are Rejected or Cancelled
  const rejectedAndCancelledOrders = orders.filter(
    (order) => order.status === "Rejected" || order.status === "Cancelled"
  );

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-4 text-red-600">
        Rejected & Cancelled Orders
      </Text>

      <FlatList
        data={rejectedAndCancelledOrders}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="bg-white p-4 mb-3 rounded-lg shadow-md border-l-4 border-red-600">
            <Text className="text-lg font-bold">{item.fuelType}</Text>
            <Text className="text-gray-600">Customer: {item.customerName}</Text>
            <Text className="text-gray-600">Location: {item.location}</Text>
            <Text className="text-gray-600">Quantity: {item.quantity}</Text>
            <Text className="text-gray-600">Price: {item.price}</Text>
            <Text className="text-gray-600">
              Payment Status: {item.paymentStatus}
            </Text>
            <Text className="text-gray-600">
              Delivery Date: {item.deliveryDate}
            </Text>
            <Text className="text-gray-600">Time: {item.time}</Text>
            <Text className="text-red-600 font-bold">
              Status: {item.status}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-600">
            No rejected or cancelled orders
          </Text>
        }
      />
    </View>
  );
};

export default RejectedOrders;
