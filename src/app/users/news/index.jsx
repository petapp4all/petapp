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
import { getUserDetails } from "../../../components/utils/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OilGasNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = await getUserDetails();
      if (user) {
        setLoggedInUser(user);
      }
    };
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const userDetails = await AsyncStorage.getItem("userDetails");
        if (!userDetails) {
          router.replace("/sign-in");
        }
        const encodedCountry = encodeURIComponent(loggedInUser?.country);
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=oil+AND+gas+AND+${encodedCountry}&apiKey=19fa4e57e51f46908f98d448ca4184f1`
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
  }, [loggedInUser]);

  return (
    <View className="mt-3 px-4 pb-7">
      {/* Header */}
      <Text className="text-lg font-bold text-gray-800 m-4">
        Daily Oil & Gas News
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="blue" className="mt-4" />
      ) : (
        <>
          {/* Top - Horizontal Scroll */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="my-1 p-2"
            contentContainerStyle={{ height: 200 }}
          >
            {news.slice(0, 10).map((item, index) => (
              <TouchableOpacity
                key={index}
                className="mr-4 shadow-md rounded-lg overflow-hidden"
                onPress={() =>
                  router.push({
                    pathname: `/users/news/${index}`,
                    params: {
                      title: item.title,
                      author: item.author,
                      content: item.content
                        ? item.content.split(" [+")[0]
                        : item.description || "Content not available.",
                      image: item.urlToImage,
                      publishedAt: item.publishedAt,
                      url: item.url,
                    },
                  })
                }
              >
                <View className="w-64 h-40 relative rounded-lg overflow-hidden">
                  <Image
                    source={{ uri: item.urlToImage }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />

                  {/* Transparent Overlay */}
                  <View
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      padding: 8,
                    }}
                  >
                    <Text className="text-base font-semibold text-white text-center">
                      {item.title.length > 50
                        ? `${item.title.substring(0, 50)}...`
                        : item.title}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Vertical Scroll Heading */}
          <Text className="text-base font-bold ml-4 my-6">
            More Oil & Gas News
          </Text>

          {/* Bottom - Vertical Scroll */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="flex-grow"
          >
            {news.slice(5).map((item, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center mb-3 bg-white p-3 rounded-lg shadow-sm "
                onPress={() =>
                  router.push({
                    pathname: `/users/news/${index}`,
                    params: {
                      title: item.title,
                      author: item.author,
                      content: item.content
                        ? item.content.split(" [+")[0]
                        : item.description || "Content not available.",
                      image: item.urlToImage,
                      publishedAt: item.publishedAt,
                      url: item.url,
                    },
                  })
                }
              >
                <Image
                  source={{ uri: item.urlToImage }}
                  className="w-20 h-20 rounded-lg mr-3"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <Text
                    className="text-sm font-bold text-gray-900 flex-shrink w-full"
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {item.title}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    {new Date(item.publishedAt).toDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default OilGasNews;
