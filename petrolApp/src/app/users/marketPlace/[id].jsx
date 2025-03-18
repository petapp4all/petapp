// import { View, Text, Image, ScrollView } from "react-native";
// import React from "react";
// import { useLocalSearchParams } from "expo-router";

// const stations = [
//   {
//     id: "1",
//     name: "Menj Oil (Lagos)",
//     logo: require("@/assets/images/menj-oil-logo.jpeg"),
//     lastUpdated: "6 hours ago",
//     sales: 0,
//     rating: 0.0,
//     pms: 830,
//     ago: 1028,
//   },
//   {
//     id: "2",
//     name: "Matrix Energy (Warri)",
//     logo: require("@/assets/images/matrix-energy-logo.png"),
//     lastUpdated: "1 hour ago",
//     sales: 0,
//     rating: 0.0,
//     pms: 857,
//     ago: null,
//   },
//   {
//     id: "3",
//     name: "Africa Terminals Nig. Ltd. (Lagos)",
//     logo: require("@/assets/images/africa-terminals-logo.png"),
//     lastUpdated: "7 hours ago",
//     sales: 0,
//     rating: 0.0,
//     pms: null,
//     ago: 1033,
//   },
//   {
//     id: "4",
//     name: "TotalEnergies (Abuja)",
//     logo: require("@/assets/images/total-logo.jpeg"),
//     lastUpdated: "3 hours ago",
//     sales: 0,
//     rating: 0.0,
//     pms: 850,
//     ago: 1040,
//   },
//   {
//     id: "5",
//     name: "Oando Plc (Lagos)",
//     logo: require("@/assets/images/oando-logo.png"),
//     lastUpdated: "5 hours ago",
//     sales: 0,
//     rating: 0.0,
//     pms: 845,
//     ago: null,
//   },
//   {
//     id: "6",
//     name: "Conoil (Port Harcourt)",
//     logo: require("@/assets/images/conoil-logo.png"),
//     lastUpdated: "2 hours ago",
//     sales: 0,
//     rating: 0.0,
//     pms: 860,
//     ago: 1050,
//   },
//   {
//     id: "7",
//     name: "MRS Oil (Ibadan)",
//     logo: require("@/assets/images/mrs-logo.png"),
//     lastUpdated: "1 hour ago",
//     sales: 0,
//     rating: 0.0,
//     pms: 840,
//     ago: null,
//   },
//   {
//     id: "8",
//     name: "Eterna Plc (Kano)",
//     logo: require("@/assets/images/eterna-logo.png"),
//     lastUpdated: "4 hours ago",
//     sales: 0,
//     rating: 0.0,
//     pms: 855,
//     ago: 1025,
//   },
// ];

// const OrderScreen = () => {
//   const { id } = useLocalSearchParams();
//   const station = stations.find((item) => item.id === id);

//   if (!station) {
//     return (
//       <View className="flex-1 items-center justify-center">
//         <Text className="text-lg text-red-500">Station not found</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView className="p-4 bg-gray-50 min-h-screen">
//       <View className="items-center">
//         <Image source={station.logo} className="w-24 h-24 rounded-lg" />
//         <Text className="text-xl font-bold text-gray-900 mt-2">
//           {station.name}
//         </Text>
//         <Text className="text-gray-500 text-sm">
//           Last updated {station.lastUpdated}
//         </Text>
//       </View>

//       <View className="border-t border-gray-200 mt-4 pt-4">
//         <Text className="text-lg font-semibold text-gray-700">Pricing</Text>
//         <Text className="text-gray-700 mt-2">
//           <Text className="font-medium">PMS:</Text>{" "}
//           {station.pms ? `₦${station.pms} per ltr` : "Not available"}
//         </Text>
//         <Text className="text-gray-700 mt-2">
//           <Text className="font-medium">AGO:</Text>{" "}
//           {station.ago ? `₦${station.ago} per ltr` : "Not available"}
//         </Text>
//       </View>

//       {/* Additional Content from the Image */}
//       <View className="border-t border-gray-200 mt-4 pt-4">
//         <Text className="text-lg font-semibold text-gray-700">
//           Additional Details
//         </Text>
//         <Text className="text-gray-700 mt-2">Sales: {station.sales}</Text>
//         <Text className="text-gray-700 mt-2">Rating: {station.rating}</Text>
//       </View>
//     </ScrollView>
//   );
// };

// export default OrderScreen;

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useState } from "react";

const products = [
  { id: "PMS", name: "PMS", price: 831 },
  { id: "DPK", name: "DPK", price: 1050 },
  { id: "ATK", name: "ATK", price: 1050 },
];

const OrderScreen = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [volume, setVolume] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [amount, setAmount] = useState("");

  // Handle product selection and update amount automatically
  const handleProductSelection = (product) => {
    setSelectedProduct(product);
    if (volume) {
      setAmount(product.price * parseInt(volume, 10));
    }
  };

  // Update amount when volume changes
  const handleVolumeChange = (value) => {
    setVolume(value);
    if (selectedProduct) {
      setAmount(selectedProduct.price * parseInt(value, 10) || "");
    }
  };

  // Check if all fields are filled
  const isFormValid = selectedProduct && volume && deliveryLocation && amount;

  return (
    <ScrollView className="p-4 bg-gray-50 min-h-screen">
      <Text className="text-lg font-semibold text-gray-800">
        Select a product
      </Text>
      <Text className="text-gray-600 text-sm">
        Select a product from the below listed products and proceed by
        completing the attached forms.
      </Text>

      {/* Product Selection */}
      {products.map((product) => (
        <TouchableOpacity
          key={product.id}
          onPress={() => handleProductSelection(product)}
          className={`border p-4 rounded-lg mt-3 ${
            selectedProduct?.id === product.id
              ? "border-red-500"
              : "border-gray-300"
          }`}
        >
          {/* Product Name and Price Section */}
          <View className="flex-row justify-between items-start">
            <Text className="text-lg font-semibold text-gray-900">
              {product.name}
            </Text>

            {/* Price Section */}
            <View className="items-end">
              <Text className="text-gray-800 font-semibold">
                ₦ {product.price.toLocaleString()}
              </Text>
              <Text className="text-gray-500 text-sm">per ltr</Text>
            </View>
          </View>

          {/* Availability */}
          <Text className="text-green-600">Available</Text>
        </TouchableOpacity>
      ))}

      {/* Volume Input */}
      <Text className="text-gray-700 mt-4">Volume (Liters)</Text>
      <TextInput
        className="border p-3 rounded-md mt-2 bg-white"
        keyboardType="numeric"
        placeholder="Enter volume"
        value={volume}
        onChangeText={handleVolumeChange}
      />

      {/* Delivery Location Input */}
      <Text className="text-gray-700 mt-4">Deliver to</Text>
      <TextInput
        className="border p-3 rounded-md mt-2 bg-white"
        placeholder="Enter delivery location"
        value={deliveryLocation}
        onChangeText={setDeliveryLocation}
      />

      {/* Amount Display */}
      <Text className="text-gray-700 mt-4">Amount</Text>
      <TextInput
        className="border p-3 rounded-md mt-2 bg-gray-200"
        editable={false}
        value={amount ? `₦ ${amount.toLocaleString()}` : ""}
      />

      {/* Proceed Button (Disabled if form is incomplete) */}
      <TouchableOpacity
        disabled={!isFormValid}
        className={`p-4 rounded-lg mt-6 ${
          isFormValid ? "bg-red-500" : "bg-gray-400"
        }`}
      >
        <Text className="text-white text-center font-semibold">Proceed</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default OrderScreen;
