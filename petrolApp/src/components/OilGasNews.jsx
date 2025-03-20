import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";

import { useRouter } from "expo-router";

const OilGasNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          "https://newsapi.org/v2/everything?q=oil+AND+gas+AND+Nigeria&apiKey=19fa4e57e51f46908f98d448ca4184f1"
        );
        const data = await response.json();

        // Sort articles by published date (most recent first) and select top 5
        const sortedArticles = data.articles
          .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
          .slice(0, 5);
        setNews(sortedArticles);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <View className="my-4 px-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-lg font-bold text-gray-800">Oil & Gas News</Text>
        <TouchableOpacity onPress={() => router.push("/users/news")}>
          <Text className="text-blue-600">See all</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="blue" className="mt-4" />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-2"
        >
          {news.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                marginRight: 16,
                backgroundColor: "white",
                shadowOpacity: 0.2,
                borderRadius: 10,
                overflow: "hidden",
              }}
              onPress={() =>
                router.push({
                  pathname: `/users/news/${index}`,
                  params: {
                    title: item.title,
                    author: item.author,
                    content: item.content
                      ? item.content.split(" [+")[0] // Remove truncated part
                      : item.description || "Content not available.",
                    image: item.urlToImage,
                    publishedAt: item.publishedAt,
                    url: item.url,
                  },
                })
              }
            >
              {/* Image Container with Overlay Text */}
              <View
                style={{
                  width: 250, // Increased width
                  height: 150, // Increased height
                  position: "relative",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <Image
                  source={{ uri: item.urlToImage }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
                {/* Text Overlay */}
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    padding: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    {item.title.length > 50
                      ? item.title.substring(0, 50) + "..."
                      : item.title}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default OilGasNews;
