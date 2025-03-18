import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import RejectedOrders from "../../../components/RejectedOrders";
import CompletedOrders from "../../../components/CompletedOrders";
import ApproveOrders from "../../../components/ApproveOrders ";

const Orders = () => {
  const [activeScreen, setActiveScreen] = useState("Rejected");

  const renderScreen = () => {
    switch (activeScreen) {
      case "Rejected":
        return <RejectedOrders />;
      case "Approve":
        return <ApproveOrders />;
      case "Completed":
        return <CompletedOrders />;
      default:
        return <RejectedOrders />;
    }
  };

  return (
    <View className="flex-1 px-2 pt-4 bg-gray-100">
      <View className="flex-row justify-around mb-4">
        <TouchableOpacity
          className={`p-2 px-4 rounded-lg ${
            activeScreen === "Rejected" ? "bg-red-500" : "bg-gray-300"
          }`}
          onPress={() => setActiveScreen("Rejected")}
        >
          <Text className="text-white font-bold">Rejected</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`p-2 px-4 rounded-lg ${
            activeScreen === "Approve" ? "bg-green-500" : "bg-gray-300"
          }`}
          onPress={() => setActiveScreen("Approve")}
        >
          <Text className="text-white font-bold">Approve</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`p-2 px-4 rounded-lg ${
            activeScreen === "Completed" ? "bg-purple-500" : "bg-gray-300"
          }`}
          onPress={() => setActiveScreen("Completed")}
        >
          <Text className="text-white font-bold">Completed</Text>
        </TouchableOpacity>
      </View>

      {renderScreen()}
    </View>
  );
};

export default Orders;
