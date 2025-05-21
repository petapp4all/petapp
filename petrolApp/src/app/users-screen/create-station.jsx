import { useEffect, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, Alert, View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { apiUrl } from "../../components/utils/utils";
import ReusableInput from "../../components/ReuseAbleInput";
import CheckboxDropdown from "../../components/CheckboxDropdown";
import { Switch } from "react-native-paper";
import ImageUploadComponent from "../../components/ImageUploadComponent";
import { useRouter } from "expo-router";

const CreateStationScreen = () => {
  const [loading, setLoading] = useState(false);
  const [ownerId, setOwnerId] = useState(null);
  const imageUploaderRef = useRef();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem("userDetails");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setOwnerId(parsedUser.id);
      }
    };
    fetchUser();
  }, []);

  const onSubmit = async (data) => {
    if (!ownerId) return Alert.alert("Error", "Owner not found");
    const { image, imageId } =
      await imageUploaderRef.current.uploadImageToServer();

    const payload = {
      ...data,
      ownerId,
      image,
      imageId,
      pms: data.pms ? Number(data.pms) : null,
      ago: data.ago ? Number(data.ago) : null,
      availableProducts: data.availableProducts || [],
      paymentMethods: data.paymentMethods || [],
      facilities: data.facilities || [],
    };

    try {
      setLoading(true);
      await axios.post(`${apiUrl}/station/create`, payload);
      Alert.alert("Success", "Station created successfully");
      router.push("/users/dashboard");
      reset();
    } catch (error) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to create station"
      );
    } finally {
      setLoading(false);
    }
  };

  const onError = (formErrors) => {
    const firstError = Object.values(formErrors)[0];
    if (firstError?.message) {
      Alert.alert("Validation Error", firstError.message);
    }
  };

  return (
    <ScrollView className="p-4">
      <ImageUploadComponent ref={imageUploaderRef} />
      {[
        {
          name: "name",
          label: "Station Name",
          icon: "gas-pump",
          fontFamily: "FontAwesome5",
          rules: { required: "Station name is required" },
        },
        {
          name: "pms",
          label: "PMS Price",
          keyboardType: "numeric",
          icon: "money",
          rules: { required: "PMS Price is required" },
        },
        {
          name: "ago",
          label: "AGO Price",
          keyboardType: "numeric",
          icon: "money",
        },
        {
          name: "address",
          label: "Use well descriptive address",
          icon: "map-marker",
          rules: { required: "Address is required" },
        },
        {
          name: "email",
          label: "Email Address",
          keyboardType: "email-address",
          icon: "envelope",
          rules: { required: "Email is required" },
        },
        {
          name: "operatingHours",
          label: "Operating Hours (eg: 8AM - 7PM)",
          icon: "clock-o",
          rules: { required: "Operating hours are required" },
        },
      ].map(({ name, label, keyboardType, icon, fontFamily, rules }) => (
        <Controller
          key={name}
          control={control}
          name={name}
          rules={rules}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <ReusableInput
                icon={icon}
                label={label}
                value={value}
                onChangeText={onChange}
                keyboardType={keyboardType || "default"}
                fontFamily={fontFamily || "FontAwesome"}
              />
            </>
          )}
        />
      ))}

      {/* Available Products */}
      <Controller
        control={control}
        name="availableProducts"
        rules={{
          validate: (v) => v?.length > 0 || "Select at least one product",
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <CheckboxDropdown
              label="Available Products"
              options={["PMS", "AGO", "DPK"]}
              value={value || []}
              onChange={onChange}
            />
          </>
        )}
      />

      {/* Payment Methods */}
      <Controller
        control={control}
        name="paymentMethods"
        rules={{
          validate: (v) =>
            v?.length > 0 || "Select at least one payment method",
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <CheckboxDropdown
              label="Payment Methods"
              options={["Cash", "POS", "Transfer"]}
              value={value || []}
              onChange={onChange}
            />
          </>
        )}
      />

      {/* Facilities */}
      <Controller
        control={control}
        name="facilities"
        render={({ field: { onChange, value } }) => (
          <CheckboxDropdown
            label="Facilities"
            options={[
              "Toilet",
              "Air Condition",
              "Restaurant",
              "Car Wash",
              "ATM",
              "Mechanic Workshop",
              "Car Repair Service",
              "Fuel Storage",
            ]}
            value={value || []}
            onChange={onChange}
          />
        )}
      />

      {/* Enable Online Ordering */}
      <View className="flex-row items-center justify-between mb-4 border border-gray-300 p-3 rounded-lg">
        <Text className="text-base">Enable Online Ordering</Text>
        <Controller
          control={control}
          name="supportedOrdering"
          render={({ field: { onChange, value } }) => (
            <Switch value={value} onValueChange={onChange} />
          )}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        className="bg-blue-600 p-3 rounded-xl mt-4 mb-10"
        onPress={handleSubmit(onSubmit, onError)}
        disabled={loading}
      >
        <Text className="text-white text-center text-lg">
          {loading ? "Creating..." : "Create Station"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreateStationScreen;
