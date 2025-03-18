import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { useSelector } from "react-redux";

const SingleUser = () => {
  const { id } = useLocalSearchParams();
  const user = useSelector((state) =>
    state.users.filteredUsers.find((u) => u.id === id)
  );

  return (
    <ScrollView className="p-4 bg-gray-100">
      {/* User Basic Info */}
      <View className="bg-white p-6 rounded-lg shadow-lg mb-4">
        <Text className="text-3xl font-bold text-center mb-4">{user.name}</Text>
        <Text className="text-xl text-gray-700">📧 Email: {user.email}</Text>
        <Text className="text-xl text-gray-700">📞 Phone: {user.phone}</Text>
        <Text className="text-xl text-gray-700">
          🏠 Address: {user.address}
        </Text>
        <Text className="text-xl text-gray-700">
          🏦 Total Transactions: {user.totalTransactions}
        </Text>
        <Text className="text-xl text-gray-700">
          🗓 Registered: {user.registeredDate}
        </Text>
        <Text
          className={`text-xl font-bold ${
            user.status === "Active" ? "text-green-500" : "text-red-500"
          }`}
        >
          ⚡ Status: {user.status}
        </Text>
        <Text className="text-xl text-gray-700">
          ⏳ Last Active: {user.lastActive}
        </Text>
      </View>

      {/* Transaction History */}
      <View className="bg-white p-6 rounded-lg shadow-lg mb-4">
        <Text className="text-2xl font-bold mb-4">💳 Transaction History</Text>
        {user.transactionHistory.map((transaction, index) => (
          <View key={index} className="border-b border-gray-300 py-3">
            <Text className="text-xl text-gray-700">
              📅 Date: {transaction.date}
            </Text>
            <Text className="text-xl text-gray-700">
              💰 Amount: ₦{transaction.amount}
            </Text>
            <Text className="text-xl text-gray-700">
              💳 Payment: {transaction.paymentMethod}
            </Text>
            <Text
              className={`text-xl font-bold ${
                transaction.status === "Completed"
                  ? "text-green-500"
                  : "text-yellow-500"
              }`}
            >
              ✅ Status: {transaction.status}
            </Text>
          </View>
        ))}
      </View>

      {/* Loyalty Rewards */}
      <View className="bg-white p-6 rounded-lg shadow-lg mb-4">
        <Text className="text-2xl font-bold mb-4">🎁 Loyalty Rewards</Text>
        <Text className="text-xl text-gray-700">
          🏆 Points Earned: {user.loyaltyRewards.pointsEarned}
        </Text>
        <Text className="text-xl text-gray-700">🎟 Redeemed Rewards:</Text>
        {user.loyaltyRewards.redeemedRewards.length > 0 ? (
          user.loyaltyRewards.redeemedRewards.map((reward, index) => (
            <Text key={index} className="text-xl text-blue-500">
              • {reward}
            </Text>
          ))
        ) : (
          <Text className="text-xl text-gray-500">No rewards redeemed</Text>
        )}
      </View>

      {/* Fuel Delivery Requests */}
      <View className="bg-white p-6 rounded-lg shadow-lg mb-4">
        <Text className="text-2xl font-bold mb-4">
          ⛽ Fuel Delivery Requests
        </Text>
        <Text className="text-xl text-gray-700">
          ⌛ Pending: {user.fuelDeliveryRequests.pending}
        </Text>
        <Text className="text-xl text-gray-700">
          ✅ Completed: {user.fuelDeliveryRequests.completed}
        </Text>
        <Text className="text-xl text-gray-700">
          ❌ Cancelled: {user.fuelDeliveryRequests.cancelled}
        </Text>
      </View>

      {/* Notifications Sent */}
      <View className="bg-white p-6 rounded-lg shadow-lg mb-4">
        <Text className="text-2xl font-bold mb-4">📢 Notifications Sent</Text>
        <Text className="text-xl text-gray-700">
          📩 Push: {user.notificationsSent.push}
        </Text>
        <Text className="text-xl text-gray-700">
          📧 Email: {user.notificationsSent.email}
        </Text>
      </View>
    </ScrollView>
  );
};

export default SingleUser;
