import { View, Text, FlatList, ActivityIndicator, Image } from "react-native";
import { useEffect, useState } from "react";
import { getAllReviews } from "../../components/utils/ads";
import { FontAwesome } from "@expo/vector-icons";

const Testimonial = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const data = await getAllReviews();
        setReviews(data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating) => (
    <View className="flex-row mt-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FontAwesome
          key={star}
          name={star <= rating ? "star" : "star-o"}
          size={16}
          color="#FFD700"
          style={{ marginRight: 4 }}
        />
      ))}
    </View>
  );

  const renderItem = ({ item }) => (
    <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200 shadow-sm">
      <View className="flex-row items-center mb-2">
        <Image
          source={
            item.user.image
              ? { uri: item.user.image }
              : require("@/assets/images/profileImage.jpeg")
          }
          className="w-10 h-10 rounded-full bg-gray-200 mr-3"
        />
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900">
            {item.user.name}
          </Text>
          <Text className="text-xs text-gray-500">
            {formatDate(item.createdAt)}
          </Text>
        </View>
      </View>

      {/* Rating on its own row */}
      {renderStars(item.rating)}

      <Text className="text-sm text-gray-700 mt-2 leading-relaxed">
        {item.content}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 p-4">
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : reviews.length === 0 ? (
        <Text className="text-center text-gray-500 mt-10">
          No testimonials available.
        </Text>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default Testimonial;
