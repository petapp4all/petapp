import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import {
  registerUser,
  requestEmailVerification,
} from "../../components/utils/users";
import ReusableInput from "../../components/ReuseAbleInput";

const countries = [
  { code: "DZ", name: "Algeria", dial: "+213", flag: "🇩🇿", maxLength: 9 },
  { code: "AO", name: "Angola", dial: "+244", flag: "🇦🇴", maxLength: 9 },
  { code: "AU", name: "Australia", dial: "+61", flag: "🇦🇺", maxLength: 9 },
  { code: "BJ", name: "Benin", dial: "+229", flag: "🇧🇯", maxLength: 8 },
  { code: "CM", name: "Cameroon", dial: "+237", flag: "🇨🇲", maxLength: 9 },
  { code: "CA", name: "Canada", dial: "+1", flag: "🇨🇦", maxLength: 10 },
  { code: "GM", name: "Gambia", dial: "+220", flag: "🇬🇲", maxLength: 7 },
  { code: "GH", name: "Ghana", dial: "+233", flag: "🇬🇭", maxLength: 9 },
  { code: "CI", name: "Ivory Coast", dial: "+225", flag: "🇨🇮", maxLength: 8 },
  { code: "KE", name: "Kenya", dial: "+254", flag: "🇰🇪", maxLength: 9 },
  { code: "LR", name: "Liberia", dial: "+231", flag: "🇱🇷", maxLength: 7 },
  { code: "LY", name: "Libya", dial: "+218", flag: "🇱🇾", maxLength: 10 },
  { code: "MX", name: "Mexico", dial: "+52", flag: "🇲🇽", maxLength: 10 },
  { code: "NG", name: "Nigeria", dial: "+234", flag: "🇳🇬", maxLength: 10 },
  { code: "SA", name: "Saudi Arabia", dial: "+966", flag: "🇸🇦", maxLength: 9 },
  { code: "ZA", name: "South Africa", dial: "+27", flag: "🇿🇦", maxLength: 9 },
  { code: "UG", name: "Uganda", dial: "+256", flag: "🇺🇬", maxLength: 9 },
  {
    code: "GB",
    name: "United Kingdom",
    dial: "+44",
    flag: "🇬🇧",
    maxLength: 10,
  },
  { code: "US", name: "USA", dial: "+1", flag: "🇺🇸", maxLength: 10 },
  { code: "ZW", name: "Zimbabwe", dial: "+263", flag: "🇿🇼", maxLength: 9 },
];

const SignUpScreen = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setphone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [emailForVerification, setEmailForVerification] = useState("");

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      Alert.alert("Success", "Registration successful!");
      router.push("/sign-in");
    },
    onError: (error) => {
      const errorMessage = error.message || "Registration failed";
      console.log("errorMessage=", errorMessage);
      Alert.alert("Error", errorMessage);
    },
  });

  const handleSignUp = async () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedCountry = country?.name?.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (
      !trimmedName ||
      !trimmedEmail ||
      !trimmedPhone ||
      !trimmedCountry ||
      !trimmedPassword ||
      !trimmedConfirmPassword
    ) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (trimmedPhone.length < 7) {
      Alert.alert("Warning!", "Please complete your phone number.");
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,15}$/;

    if (!passwordRegex.test(trimmedPassword)) {
      Alert.alert(
        "Password Validation Failed",
        "Password must be 8 to 15 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    const userData = {
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      country: trimmedCountry,
      password: trimmedPassword,
    };

    try {
      await requestEmailVerification(userData);
      setEmailForVerification(trimmedEmail);
      setShowCodeModal(true); // open verification modal
    } catch (error) {
      console.log("Verification Request Failed:", error);
      Alert.alert("Error", "Could not send verification code.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 w-full bg-[#fff]"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <Modal visible={showCodeModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className="bg-white w-4/5 p-6 rounded-xl shadow-lg">
            <Text className="text-lg font-semibold mb-4 text-center">
              Enter Verification Code
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-2 text-center text-xl tracking-widest"
              keyboardType="number-pad"
              maxLength={6}
              value={verificationCode}
              onChangeText={setVerificationCode}
            />
            <TouchableOpacity
              onPress={async () => {
                setVerifying(true);
                try {
                  const result = await verifyEmailCode(
                    emailForVerification,
                    verificationCode
                  );
                  setShowCodeModal(false);
                  Alert.alert("Success", "Account verified and created!");
                  router.push("/sign-in");
                } catch (err) {
                  console.log("Verification failed:", err);
                  Alert.alert("Invalid Code", "Please try again.");
                } finally {
                  setVerifying(false);
                }
              }}
              disabled={verifying || verificationCode.length !== 6}
              className="mt-5 bg-blue-600 py-3 rounded-lg"
            >
              {verifying ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-center font-semibold text-lg">
                  Verify
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowCodeModal(false)}
              className="mt-4"
            >
              <Text className="text-center text-gray-500">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full p-1 rounded-2xl md:max-w-md self-center ">
          <View className="p-5 bg-white rounded-2xl w-full shadow-lg border border-white/20 backdrop-blur-md">
            <ReusableInput
              icon="user"
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
            />
            <ReusableInput
              icon="envelope"
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <View className="mb-6 ">
              <TouchableOpacity
                className="p-4  rounded-lg mb-6"
                onPress={() => setModalVisible(true)}
              >
                <Text
                  className={
                    country ? "text-black text-lg" : "text-[#999] text-lg"
                  }
                >
                  {country
                    ? `${country.flag} ${country.name} (${country.dial})`
                    : "🌍     Select Country"}
                </Text>
              </TouchableOpacity>
            </View>
            <ReusableInput
              icon="phone"
              label="Phone Number"
              value={phone}
              onChangeText={(text) => {
                if (!country) {
                  Alert.alert("Error", "Please select a country first");
                  return;
                }

                const dialCode = country.dial;
                const maxLength = country.maxLength;

                // Ensure dial code is at the beginning
                if (!text.startsWith(dialCode)) {
                  text = dialCode + text.replace(/^\+\d+/, ""); // Remove previous dial codes
                }

                // Extract numeric part (excluding dial code)
                let numericPart = text.replace(dialCode, "").replace(/\D/g, ""); // Keep only numbers

                // Prevent leading 0
                if (numericPart.startsWith("0")) {
                  numericPart = numericPart.slice(1);
                }

                // Limit to maxLength
                numericPart = numericPart.slice(0, maxLength);

                // Update the phone state
                setphone(dialCode + numericPart);
              }}
              keyboardType="phone-pad"
            />

            <ReusableInput
              icon="lock"
              label="Password"
              value={password}
              onChangeText={(text) => setPassword(text.replace(/\s/g, ""))}
              isPassword
            />

            <ReusableInput
              icon="lock"
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) =>
                setConfirmPassword(text.replace(/\s/g, ""))
              }
              isPassword
            />

            <TouchableOpacity
              className="rounded-lg overflow-hidden mt-6"
              onPress={handleSignUp}
              disabled={mutation.isPending}
            >
              <LinearGradient
                colors={["#0072FF", "#00C6FF"]}
                className="px-6 py-3 rounded-lg flex-row justify-center items-center"
                style={{ opacity: mutation.isPending ? 0.5 : 1 }}
              >
                {mutation.isPending ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text className="text-white text-lg text-center font-semibold">
                    Sign Up
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              className="mt-4"
              onPress={() => router.push("/sign-in")}
            >
              <Text className=" text-center">
                Already have an account?{" "}
                <Text className="text-blue-500 font-semibold">Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* Country Picker Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <View className="flex-1 bg-white p-4">
          <View className="flex-row items-center mb-4">
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
            <Text className="text-xl font-bold flex-1 text-center">
              Select Country
            </Text>
          </View>

          {/* 🔍 Search Input */}
          <View className="mb-4 px-2">
            <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2">
              <FontAwesome name="search" size={16} color="gray" />
              <TextInput
                placeholder="Search by country name or code"
                className="flex-1 ml-2 text-base text-gray-700"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* 🔽 Filtered Country List */}
          <FlatList
            data={countries.filter(
              (item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.code.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            keyExtractor={(item) => item.code}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setCountry(item);
                  setphone(item.dial);
                  setModalVisible(false);
                  setSearchQuery(""); // Clear search on selection
                }}
              >
                <View className="flex-row items-center justify-between p-3 border-b border-gray-200">
                  <View className="flex-row items-center space-x-3">
                    <Text className="text-2xl m-4">{item.flag}</Text>
                    <Text className="text-lg">
                      {item.code} - {item.name}
                    </Text>
                  </View>
                  <Text className="text-lg text-gray-500">{item.dial}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
