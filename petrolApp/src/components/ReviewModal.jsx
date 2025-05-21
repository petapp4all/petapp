import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const ReviewModal = ({
  visible,
  onClose,
  onSubmit,
  reviewText,
  setReviewText,
  rating,
  setRating,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black bg-opacity-60">
        <View className="bg-white p-5 rounded-xl w-11/12 shadow-lg">
          <Text className="text-lg font-bold mb-2">Write a Review</Text>

          <TextInput
            placeholder="Your review..."
            value={reviewText}
            onChangeText={setReviewText}
            className="border border-gray-300 rounded-lg p-2 mb-3 h-24 text-gray-800"
            multiline
          />

          <Text className="mb-2 font-medium">Rating:</Text>
          <View className="flex-row mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <FontAwesome
                  name={star <= rating ? "star" : "star-o"}
                  size={32}
                  color="#FFD700"
                  style={{ marginHorizontal: 4 }}
                />
              </TouchableOpacity>
            ))}
          </View>

          <View className="flex-row justify-between">
            <TouchableOpacity
              className="bg-gray-300 p-2 px-4 rounded-lg"
              onPress={onClose}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-green-600 p-2 px-4 rounded-lg"
              onPress={onSubmit}
            >
              <Text className="text-white">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ReviewModal;
