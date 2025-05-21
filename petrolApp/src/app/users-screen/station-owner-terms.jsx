import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const StationOwnerTerms = () => {
  const router = useRouter();
  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-black mb-4">
        Station Owner Terms and Conditions
      </Text>

      <Text className="text-gray-700 mb-4">
        These terms and conditions govern your access to and use of Splantom
        PetrolApp as a registered station owner. By creating a station owner
        account, you agree to comply with these terms.
      </Text>

      <Text className="text-lg font-bold text-black">1. Eligibility</Text>
      <Text className="text-gray-700 mb-4">
        Only individuals or entities with legal authorization to operate a fuel
        station are eligible to register as station owners. Proof of ownership
        or operation may be required during account verification.
      </Text>

      <Text className="text-lg font-bold text-black">
        2. Station Information Accuracy
      </Text>
      <Text className="text-gray-700 mb-4">
        You are responsible for providing accurate and up-to-date station
        details, including address, fuel pricing, facilities, and hours of
        operation. Misrepresentation may result in suspension or termination of
        your account.
      </Text>

      <Text className="text-lg font-bold text-black">
        3. Compliance Obligations
      </Text>
      <Text className="text-gray-700 mb-4">
        Station owners must comply with all applicable local and national laws
        and safety regulations related to fuel distribution and station
        operation. Splantom PetrolApp assumes no liability for regulatory
        non-compliance.
      </Text>

      <Text className="text-lg font-bold text-black">
        4. Orders and Transactions
      </Text>
      <Text className="text-gray-700 mb-4">
        Station owners are responsible for reviewing and fulfilling order
        requests received through the platform. You must verify and confirm
        receipt of valid payment proofs prior to fulfilling any order.
      </Text>

      <Text className="text-lg font-bold text-black">
        5. Data Usage and Privacy
      </Text>
      <Text className="text-gray-700 mb-4">
        Information provided will be used in accordance with our privacy policy.
        Splantom PetrolApp may display station data (excluding sensitive
        personal information) for user visibility and transparency.
      </Text>

      <Text className="text-lg font-bold text-black">6. Platform Conduct</Text>
      <Text className="text-gray-700 mb-4">
        Misuse of the platform, including fraudulent listings, price
        manipulation, or deceptive practices, is strictly prohibited. Violations
        may result in permanent removal from the platform.
      </Text>

      <Text className="text-lg font-bold text-black">7. Termination</Text>
      <Text className="text-gray-700 mb-4">
        Splantom PetrolApp reserves the right to suspend or terminate your
        station owner account at any time if there is a breach of these terms,
        or if your activity is deemed harmful to the platform or users.
      </Text>

      <Text className="text-lg font-bold text-black">8. Amendments</Text>
      <Text className="text-gray-700 mb-4">
        These terms may be updated at our discretion. Continued use of the
        platform after changes are published constitutes acceptance of the
        revised terms.
      </Text>

      <TouchableOpacity
        className={"p-4 rounded-xl bg-blue-600 mb-14"}
        onPress={() => router.push("/users-screen/create-station")}
      >
        <Text className="text-white text-center text-lg font-semibold">
          Agree and Continue
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default StationOwnerTerms;
