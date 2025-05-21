import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
// Assuming getOrders returns the sample `datas`
import { getOrders } from "../../components/utils/ads";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatCurrency = (amount) =>
    `₦${amount.toLocaleString("en-NG", {
      minimumFractionDigits: 0,
    })}`;

  const renderItem = ({ item }) => (
    <View className="bg-white rounded-2xl shadow-md p-4 mb-4 border border-gray-200">
      <Text className="text-lg font-bold text-gray-800 mb-2">
        Order ID: {item.id}
      </Text>
      <Text className="text-gray-600">Customer: {item.userName}</Text>
      <Text className="text-gray-600">Phone: {item.userPhone}</Text>
      <Text className="text-gray-600">Fuel Type: {item.fuelType}</Text>
      <Text className="text-gray-600">Litres: {item.litres}</Text>
      <Text className="text-gray-600">
        Total Amount: {formatCurrency(item.totalAmount)}
      </Text>
      <Text className="text-gray-600">
        Delivery Address: {item.deliveryAddress}
      </Text>
      <Text className="text-gray-600">
        Expected Delivery: {formatDate(item.expectedDateTime)}
      </Text>
      <Text className="text-gray-500 text-sm mt-2">
        Station Name: {item.stationName}
      </Text>
      <Text className="text-gray-500 text-sm mt-2">
        Station Email: {item.stationEmail}
      </Text>
      {item.completed && (
        <Text className="text-green-600 mt-4 font-semibold">Completed ✅</Text>
      )}
    </View>
  );

  return (
    <View className="flex-1 p-4 bg-gray-50">
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={orders}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default OrderList;
