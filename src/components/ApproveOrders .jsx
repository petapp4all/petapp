import React, { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { orders as initialOrders } from "@/src/components/utils/utils";
import {
  setOrders,
  approveOrder,
  rejectOrder,
} from "../redux/slices/ordersSlice";

const ApproveOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);

  // Load orders into Redux state when component mounts
  useEffect(() => {
    dispatch(setOrders(initialOrders));
  }, [dispatch]);

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-4">Approve Pending Orders</Text>

      <FlatList
        data={orders
          .filter((order) => order.status === "Pending")
          .sort((a, b) => new Date(a.time) - new Date(b.time))}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="bg-white p-4 mb-3 rounded-lg shadow-md">
            {/* Order Details */}
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-lg font-semibold">{item.fuelType}</Text>
              <Text className="text-gray-500 text-sm">
                {format(new Date(item.time), "yyyy-MM-dd HH:mm:ss")}
              </Text>
            </View>

            <Text className="text-gray-600">Customer: {item.customerName}</Text>
            <Text className="text-gray-600">Location: {item.location}</Text>
            <Text className="text-gray-600">Quantity: {item.quantity}</Text>
            <Text className="text-gray-600">Price: {item.price}</Text>
            <Text className="text-gray-600">
              Payment Status: {item.paymentStatus}
            </Text>
            <Text className="text-gray-600 mb-2">
              Delivery Date: {item.deliveryDate}
            </Text>

            {/* Buttons for Approval and Rejection */}
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-green-500 flex-1 mr-2 p-2 rounded-lg items-center"
                onPress={() => dispatch(approveOrder(item.id))}
              >
                <Text className="text-white font-bold">Approve</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-red-500 flex-1 p-2 rounded-lg items-center"
                onPress={() => dispatch(rejectOrder(item.id))}
              >
                <Text className="text-white font-bold">Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>No pending orders</Text>}
      />
    </View>
  );
};

export default ApproveOrders;
