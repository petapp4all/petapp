import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { searchStations } from "../redux/slices/stationSlice";

const Search = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();

  const handleSearch = (text) => {
    setQuery(text);
    dispatch(searchStations(text));
  };

  const clearSearch = () => {
    setQuery(""); // Clear input immediately
    dispatch(searchStations("")); // Dispatch after clearing
  };

  return (
    <View className="p-3 bg-white rounded-lg shadow-md">
      <View className="relative">
        {/* Search Icon */}
        <Feather
          name="search"
          size={20}
          color="gray"
          style={{
            position: "absolute",
            left: 10,
            top: "50%",
            transform: [{ translateY: -10 }],
          }}
        />

        {/* Input Field */}
        <TextInput
          className="border border-gray-300 rounded-lg px-10 py-2 text-gray-900"
          placeholder="Search stations by name..."
          value={query}
          onChangeText={handleSearch}
          style={{ paddingRight: query.length > 0 ? 35 : 10 }}
        />

        {/* Clear Icon */}
        {query.length > 0 && (
          <TouchableOpacity
            onPress={clearSearch} // Call clearSearch function
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: [{ translateY: -10 }],
            }}
          >
            <AntDesign name="closecircle" size={20} color="gray" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Search;
