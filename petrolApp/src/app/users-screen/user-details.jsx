import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { getUserById, updateUser } from "../../components/utils/users";
import ReusableInput from "../../components/ReuseAbleInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageUploadComponent from "../../components/ImageUploadComponent";

const UserDetails = () => {
  const [loading, setLoading] = useState(false);
  const imageUploaderRef = useRef();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userData = await AsyncStorage.getItem("userDetails");
      const parsedUser = JSON.parse(userData);
      const user = await getUserById(parsedUser.id);
      if (user) {
        setUser(user);
        setFullName(user.name || "");
        setEmail(user.email || "");
        setPhoneNumber(user.phone || "");
        setAddress(user.address || "");
      }
    };
    fetchUserDetails();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const { image, imageId } =
        await imageUploaderRef.current.uploadImageToServer();

      const updatedUser = {
        ...user,
        image,
        imageId,
      };
      await updateUser(updatedUser);

      Alert.alert("Success", "User details updated successfully!");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update user details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-100"
      contentContainerStyle={{ padding: 20 }}
    >
      <View className="items-center">
        {user && (
          <ImageUploadComponent
            ref={imageUploaderRef}
            initialImage={user.image}
            initialImageId={user.imageId}
          />
        )}

        <ReusableInput
          icon="user"
          label="Full Name"
          value={user?.name || ""}
          onChangeText={(text) => setUser((prev) => ({ ...prev, name: text }))}
        />
        <ReusableInput
          icon="envelope"
          label="Email"
          value={user?.email || ""}
          onChangeText={(text) => setUser((prev) => ({ ...prev, email: text }))}
        />
        <ReusableInput
          icon="map-marker"
          label="Use a well descriptive address"
          value={user?.address || ""}
          onChangeText={(text) =>
            setUser((prev) => ({ ...prev, address: text }))
          }
        />
        <ReusableInput
          icon="phone"
          label="Phone Number"
          value={user?.phone || ""}
          onChangeText={(text) => setUser((prev) => ({ ...prev, phone: text }))}
        />

        <TouchableOpacity
          className="w-full p-3 rounded-lg flex-row justify-center items-center mt-4"
          style={{
            backgroundColor: loading
              ? "rgba(59, 130, 246, 0.5)"
              : "rgb(59, 130, 246)",
          }}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold">Update</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default UserDetails;
