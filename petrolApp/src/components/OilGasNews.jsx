import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { getUserDetails } from "./utils/auth";

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
        const encodedCountry = encodeURIComponent(loggedInUser?.country);
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=oil+AND+gas+AND+${encodedCountry}&apiKey=19fa4e57e51f46908f98d448ca4184f1`
        );
        const data = await response.json();

        if (data.articles) {
          const sortedArticles = data.articles
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
            .slice(0, 5);
          setNews(sortedArticles);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [loggedInUser]);

  return (
    <View style={{ marginVertical: 16, paddingHorizontal: 16 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>
          Oil & Gas News
        </Text>
        <TouchableOpacity onPress={() => router.push("/users/news")}>
          <Text style={{ color: "blue" }}>See all</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="blue"
          style={{ marginTop: 16 }}
        />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 8 }}
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
                      ? item.content.split(" [+")[0]
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
                  width: 250,
                  height: 150,
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
                      ? `${item.title.substring(0, 50)}...`
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
