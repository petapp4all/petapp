import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { searchUsers, sortUsers, resetUsers } from "../redux/slices/userSlice";

const SearchAndSort = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const dispatch = useDispatch();
  const { sortBy, sortOrder } = useSelector((state) => state.users);

  // Reset search and sort on mount
  useEffect(() => {
    setSearchQuery("");
    dispatch(resetUsers());
  }, [dispatch]);

  const handleInputChange = (text) => {
    setSearchQuery(text);
    dispatch(searchUsers(text));
  };

  const handleSort = (field) => {
    dispatch(sortUsers({ field }));
    setShowSortOptions(false); // Hide dropdown after selecting an option
  };

  return (
    <View className="p-3 bg-white rounded-lg shadow-md z-10">
      {/* Search & Filter Row */}
      <View className="flex-row items-center space-x-2">
        {/* Filter Button */}
        <TouchableOpacity
          onPress={() => setShowSortOptions(!showSortOptions)}
          className="p-2 bg-gray-200 rounded-lg"
        >
          <Feather name="filter" size={30} color="black" />
        </TouchableOpacity>

        {/* Search Input */}
        <View className="flex-1 flex-row items-center border border-gray-300 ml-3 rounded-lg px-2 ">
          <Feather name="search" size={20} color="gray" />
          <TextInput
            className="flex-1 ml-1 py-3"
            placeholder="Search users..."
            value={searchQuery}
            onChangeText={handleInputChange}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleInputChange("")}>
              <AntDesign name="closecircle" size={20} color="gray" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Dropdown Options */}
      {showSortOptions && (
        <View className="absolute top-14 left-3 bg-white w-[150px] p-3 rounded-lg shadow-2xl shadow-black ">
          <Text className="font-bold mb-2 text-3xl">Sort By</Text>
          {["name", "email", "status"].map((field) => (
            <TouchableOpacity
              key={field}
              onPress={() => handleSort(field)}
              className="p-2"
            >
              <Text className="text-black capitalize text-3xl">
                {field}{" "}
                {sortBy === field ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default SearchAndSort;
