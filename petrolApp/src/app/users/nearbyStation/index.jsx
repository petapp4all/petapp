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

const nearbyStation = () => {
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

        // Sort articles by published date (most recent first) and select top 25
        const sortedArticles = data.articles
          .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
          .slice(0, 25);
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
    <View className="h-screen bg-blue-600 items-center justify-center">
      <Text className="text-white text-3xl font-bold">
        See All Nearby Station
      </Text>
      <Text className="text-white text-2xl font-bold">
        Price and other info
      </Text>
    </View>
  );
};

export default nearbyStation;
