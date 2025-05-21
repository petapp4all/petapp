import { View, Text, ScrollView } from "react-native";
import React from "react";

const TermsAndCondition = () => {
  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-gray-700 mb-4">
        Welcome to Splantom PetrolApp! These terms and conditions outline the
        rules and regulations for the use of our platform.
      </Text>

      <Text className="text-lg font-bold text-black">1. Introduction</Text>
      <Text className="text-gray-700 mb-4">
        By accessing this platform, we assume you accept these terms and
        conditions. Do not continue to use Splantom PetrolApp if you do not
        agree to all of the terms and conditions stated on this page.
      </Text>

      <Text className="text-lg font-bold text-black">2. User Accounts</Text>
      <Text className="text-gray-700 mb-4">
        When you create an account with us, you must provide accurate, complete,
        and current information at all times. Failure to do so constitutes a
        breach of the terms, which may result in immediate termination of your
        account.
      </Text>

      <Text className="text-lg font-bold text-black">3. Market Prices</Text>
      <Text className="text-gray-700 mb-4">
        Splantom PetrolApp allows users to view market prices of petrol and
        diesel all over the word. These prices are subject to change.
      </Text>

      <Text className="text-lg font-bold text-black">
        4. Order Requests and Payments
      </Text>
      <Text className="text-gray-700 mb-4">
        Users can send order requests and upload proof of payment once an order
        request is accepted. Users are responsible for ensuring the accuracy of
        the order and payment details.
      </Text>

      <Text className="text-lg font-bold text-black">5. User Conduct</Text>
      <Text className="text-gray-700 mb-4">
        Users must not use the platform in any way that causes or may cause
        damage to the platform or impairment of its availability.
      </Text>

      <Text className="text-lg font-bold text-black">6. Termination</Text>
      <Text className="text-gray-700 mb-4">
        We may terminate or suspend access to our platform immediately, without
        prior notice or liability, for any reason, including if you breach the
        terms.
      </Text>

      <Text className="text-lg font-bold text-black ">7. Changes to Terms</Text>
      <Text className="text-gray-700 mb-14">
        We reserve the right, at our sole discretion, to modify or replace these
        terms at any time. If a revision is material, we will try to provide at
        least 30 days' notice prior to new terms taking effect.
      </Text>
    </ScrollView>
  );
};

export default TermsAndCondition;
