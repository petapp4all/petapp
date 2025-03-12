import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React from "react";

const newsData = [
  {
    id: 1,
    title: "FG To Empower ....",
    image: require("@/assets/images/gas1.jpeg"),
  },
  {
    id: 2,
    title: "Oil Prices Rise....",
    image: require("@/assets/images/gas3.jpeg"),
  },
  {
    id: 3,
    title: "New Policies...",
    image: require("@/assets/images/gas2.jpeg"),
  },
];

const OilGasNews = () => {
  return (
    <View className="my-4">
      <View className="flex-row justify-between items-center px-4">
        <Text className="text-lg font-bold text-gray-800">Oil & Gas News</Text>
        <TouchableOpacity>
          <Text className="text-blue-600">See all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-2 px-4"
      >
        {newsData.map((news) => (
          <TouchableOpacity
            key={news.id}
            style={{
              marginRight: 16,
              backgroundColor: "white",
              shadowOpacity: 0.2,
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: 160,
                height: 96,
                overflow: "hidden",
                borderRadius: 8,
              }}
            >
              <Image
                source={news.image}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>

            <View style={{ padding: 8 }}>
              <Text
                style={{ fontSize: 12, fontWeight: "600", color: "#4a4a4a" }}
              >
                {news.title}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default OilGasNews;
