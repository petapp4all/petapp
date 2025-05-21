import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Alert,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { useRef, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import { useMutation } from "@tanstack/react-query";
import {
  getUserDetails,
  linkPushTokenToUser,
  loginUser,
} from "../../components/utils/users";
import ReusableInput from "../../components/ReuseAbleInput";

const SignInScreen = () => {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [email, setEmail] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [password, setPassword] = useState("");
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = await getUserDetails();
      if (user) {
        setEmail(user.email);
        setUserLoggedIn(true);
        setLoggedInUser(user);
      }
    };
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const checkBiometricSupport = async () => {
      // await AsyncStorage.removeItem("userDetails");
      // setUserLoggedIn(false);
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    };
    checkBiometricSupport();
  }, []);

  const handleLoginWithBiometrics = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate with Fingerprint",
      });

      if (result.success) {
        const userDetailsString = await AsyncStorage.getItem("userDetails");
        if (userDetailsString) {
          const userDetails = JSON.parse(userDetailsString);
          Keyboard.dismiss();
          Alert.alert("Success", "Authenticated successfully!");
          await linkPushTokenToUser();
          if (userDetails.role === "USER") {
            router.replace("/users/dashboard");
          } else {
            router.replace("/admin/dashboard");
          }
        }
      } else {
        Alert.alert("Error", "Authentication failed.");
      }
    } catch (error) {
      console.error("Biometric authentication error:", error.message);
      Alert.alert("Error", "An unexpected error occurred. Try again.");
    }
  };

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      Keyboard.dismiss();
      Alert.alert("Success", "Login successful!");
      if (data.role === "USER") {
        router.replace("/users/dashboard");
      } else {
        router.replace("/admin/dashboard");
      }
    },
    onError: (error) => {
      Keyboard.dismiss();
      const errorMessage =
        error.message || "Something went wrong, please try again";
      Alert.alert("Error", errorMessage);
    },
  });

  // Fade-in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Animated.View
        style={{ opacity: fadeAnim }}
        className="w-full bg-white max-w-md p-1"
      >
        {/* Show welcome message if user is already logged in */}
        {userLoggedIn ? (
          <>
            <Text className="text-3xl font-extrabold text-center tracking-wide">
              Welcome Back
            </Text>
            <Text className="capitalize text-2xl font-extrabold text-center mb-6 tracking-wide">
              {loggedInUser.name}
            </Text>
          </>
        ) : (
          <Text className="text-4xl font-extrabold text-center mb-6 tracking-wide">
            Sign In
          </Text>
        )}

        <View className="p-3 rounded-3xl w-full shadow-lg backdrop-blur-md bg-white">
          {/* Show password input only if user is already logged in */}
          {!userLoggedIn && (
            <ReusableInput
              icon="envelope"
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          )}
          {/* Password Input */}
          <ReusableInput
            icon="lock"
            label="Password"
            value={password}
            onChangeText={(text) => setPassword(text.replace(/\s/g, ""))}
            isPassword
          />

          {/* Sign-In Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            className="rounded-lg overflow-hidden shadow-xl mt-6"
            onPress={() => mutation.mutate({ email, password })}
            disabled={
              (userLoggedIn ? !password : !email || !password) ||
              mutation.isPending
            }
          >
            <LinearGradient
              colors={["#0072FF", "#00C6FF"]}
              className="px-6 py-3 rounded-lg"
              style={{ opacity: mutation.isPending ? 0.5 : 1 }}
            >
              {mutation.isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text className="text-white text-lg text-center font-semibold tracking-wide">
                  Sign In
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
          {isBiometricSupported && userLoggedIn && (
            <View className="mt-4">
              <TouchableOpacity
                className="mt-3 px-6 py-3 text-lg bg-blue-600 rounded-lg"
                onPress={handleLoginWithBiometrics}
              >
                <Text className="text-white text-center font-semibold">
                  Sign In with Fingerprint
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {/* Switch Account Button */}

          {userLoggedIn && (
            <TouchableOpacity
              className="mt-5"
              onPress={() => {
                Alert.alert(
                  "Warning",
                  "This action will clear your saved email, password, and other saved settings from this device. Do you want to continue?",
                  [
                    {
                      text: "CANCEL",
                      style: "cancel",
                    },
                    {
                      text: "PROCEED",
                      onPress: async () => {
                        await AsyncStorage.removeItem("userDetails");
                        setUserLoggedIn(false);
                        setEmail("");
                        setPassword("");
                        Alert.alert(
                          "Success",
                          "All saved data has been cleared. You can now sign in with another account."
                        );
                        router.replace("/sign-in");
                      },
                    },
                  ]
                );
              }}
            >
              <Text className=" text-center text-base">
                Not {loggedInUser.name}?{" "}
                <Text className="font-semibold">Switch Account</Text>
              </Text>
            </TouchableOpacity>
          )}
          {/* Forgot Password Link */}
          {!userLoggedIn && (
            <TouchableOpacity
              className="mt-4"
              onPress={() => router.push("/forgot-password")}
            >
              <Text className="text-center text-base">
                Forgot your password?{" "}
                <Text className="text-blue-500 font-semibold">Reset here</Text>
              </Text>
            </TouchableOpacity>
          )}
          {/* Sign-Up Navigation */}
          {!userLoggedIn && (
            <TouchableOpacity
              className="mt-4"
              // onPress={() => router.push("/text")}
              onPress={() => router.push("/sign-up")}
            >
              <Text className="text-center text-base">
                Don't have an account?{" "}
                <Text className="text-blue-500 font-semibold">Sign Up</Text>
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

export default SignInScreen;
