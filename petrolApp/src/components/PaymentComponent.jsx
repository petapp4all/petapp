import { useRouter } from "expo-router"; // ADD THIS
import { Alert, Button, Text, View, Modal } from "react-native";
import { useState, useCallback, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "expo-router";
import { getUserDetails, sendPin } from "./utils/users";

const PaymentComponent = ({ pricingData }) => {
  const router = useRouter();
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [email, setEmail] = useState("");
  const [pinValidity, setPinValidity] = useState("");

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        try {
          const user = await getUserDetails();
          if (user?.email) setEmail(user.email);

          if (pricingData.length > 0) {
            setSelectedPlanId(pricingData[0].id);
            setPinValidity(pricingData[0].duration);
          }
        } catch (error) {
          console.log("Error fetching user data:", error);
        }
      };
      fetchUser();
    }, [pricingData])
  );

  const selectedPlan = pricingData.find((p) => p.id === selectedPlanId);

  const initiatePayment = async () => {
    if (!selectedPlan) {
      return Alert.alert("Error", "Please select a plan");
    }

    try {
      const response = await fetch(
        "https://api.paystack.co/transaction/initialize",
        {
          method: "POST",
          headers: {
            Authorization:
              "Bearer sk_live_fbf6a943f3b15e67bbea5f05db6915a2a1f4e6cd",
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email,
            amount: selectedPlan.convertedAmount * 100,
            currency: selectedPlan.currency, // e.g. USD, GBP, etc.
            callback_url: "https://success.com/payment-complete",
            metadata: {
              cancel_action: "https://success.com/payment-cancel",
              redirect_after_success: true,
            },
          }),
        }
      );

      const data = await response.json();
      if (data.status) {
        const { authorization_url } = data.data;
        router.push(
          `/users-screen/webview?url=${encodeURIComponent(
            authorization_url
          )}&email=${encodeURIComponent(
            email
          )}&pinValidity=${encodeURIComponent(pinValidity)}`
        );
      } else {
        Alert.alert(
          "Error",
          data.message || "Failed to initialize transaction."
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred during payment initialization.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      <Picker
        selectedValue={selectedPlanId}
        onValueChange={(itemValue) => {
          setSelectedPlanId(itemValue);
          const plan = pricingData.find((p) => p.id === itemValue);
          if (plan) setPinValidity(plan.duration);
        }}
      >
        {pricingData.map((plan) => (
          <Picker.Item
            key={plan.id}
            label={`${plan.durationLabel} - ₦${plan.amount.toLocaleString()}${
              plan.convertedAmount && plan.currency !== "NGN"
                ? ` (~${plan.convertedAmount} ${plan.currency})`
                : ""
            }`}
            value={plan.id}
          />
        ))}
      </Picker>

      <Text style={{ marginVertical: 10 }}>
        You will receive an advert PIN valid for{" "}
        <Text style={{ fontWeight: "bold" }}>{pinValidity}</Text> after payment.
      </Text>

      <Button onPress={initiatePayment} title="Make Payment" />
    </View>
  );
};

export default PaymentComponent;
