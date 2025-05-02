import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Picker } from "@react-native-picker/picker";

const PlaceOrder = () => {
  const { stationId, stationName, pms, ago } = useLocalSearchParams();
  const [fuelType, setFuelType] = useState("pms");
  const [litres, setLitres] = useState("");

  const pricePerLitre = fuelType === "pms" ? Number(pms) : Number(ago);
  const total = litres ? (Number(litres) * pricePerLitre).toFixed(2) : 0;

  return (
    <View className="flex-1 bg-white p-5">
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

      <Text className="text-lg font-semibold text-gray-800 mb-6">
        Total: ₦{Number(total).toLocaleString()}
      </Text>

      <View className="bg-blue-600 py-3 rounded-xl">
        <Text className="text-center text-white font-bold text-base">
          Place Order
        </Text>
      </View>
    </View>
  );
};

export default PlaceOrder;
