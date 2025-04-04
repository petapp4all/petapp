import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import SearchAndSort from "../../../components/SearchAndSort";

const Users = () => {
  const users = useSelector((state) => state.users.filteredUsers);
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-100 p-2">
      <SearchAndSort />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="w-full bg-white shadow-md rounded-lg ">
          {/* Table Header */}
          <View className="flex-row border-b border-gray-300 p-3 bg-gray-200">
            <Text className="w-1/3 px-4 font-bold text-gray-700 text-left">
              Name
            </Text>
            <Text className="w-1/3 px-4 font-bold text-gray-700 text-left">
              Status
            </Text>
            <Text className="w-1/3 px-4 font-bold text-gray-700 text-left">
              Phone
            </Text>
          </View>

          {/* Table Rows */}
          {users.map((user, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(`/admin/users/${user.id}`)}
            >
              <View className="flex-row border-b border-gray-300 p-3 items-center">
                <View className="w-[40%] px-1">
                  <Text className="font-bold text-base">{user.name}</Text>
                  <Text className="text-gray-500 text-sm">{user.email}</Text>
                </View>
                <View className="w-1/3 px-1">
                  <Text
                    className={`font-bold text-lg ${
                      user.status === "Active"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {user.status}
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    Last login: {user.lastActive}
                  </Text>
                </View>
                <View className="w-1/3 px-1">
                  <Text className="font-bold">{user.phone}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Users;
