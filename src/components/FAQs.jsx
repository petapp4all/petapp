import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Linking } from "react-native";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";

const faqData = [
  {
    question: "What is Splantom PetrolApp?",
    answer:
      "Splantom PetrolApp provides real-time fuel price updates and station comparisons to help users make informed fuel purchasing decisions.",
  },
  {
    question: "How do I compare petrol prices nearby?",
    answer:
      "Our app fetches real-time fuel prices from nearby petrol stations, allowing you to compare prices and choose the best option.",
  },
  // {
  //   question: "Is fuel ordering available?",
  //   answer:
  //     "Yes! You can order fuel directly from participating stations within the app for convenient delivery or pickup.",
  // },
];

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const animations = useRef(faqData.map(() => new Animated.Value(0))).current;

  const phoneNumber = "07032429235";
  const emailAddress = "petapp4all@gmail.com";

  const handleWhatsApp = () => {
    const url = `https://wa.me/234${phoneNumber.slice(1)}`;
    Linking.openURL(url).catch(() => alert("Failed to open WhatsApp"));
  };

  const handleCall = () => {
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch(() => alert("Failed to make a call"));
  };

  const handleEmail = () => {
    const url = `mailto:${emailAddress}`;
    Linking.openURL(url).catch(() => alert("Failed to open email client"));
  };

  const toggleFAQ = (index) => {
    if (activeIndex === index) {
      // Close the currently open FAQ
      Animated.timing(animations[index], {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setActiveIndex(null));
    } else {
      // Close the previously open FAQ (if any)
      if (activeIndex !== null) {
        Animated.timing(animations[activeIndex], {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
      setActiveIndex(index);
      Animated.timing(animations[index], {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
        Frequently Asked Questions & Answers
      </Text>
      <Text style={{ fontSize: 16, color: "#555", marginBottom: 20 }}>
        Find answers to common questions about Splantom PetrolApp.
      </Text>

      {faqData.map((item, index) => {
        const heightInterpolation = animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0, 100],
        });

        return (
          <View
            key={index}
            style={{
              marginBottom: 10,
              borderBottomWidth: 1,
              borderColor: "#ccc",
            }}
          >
            <TouchableOpacity
              onPress={() => toggleFAQ(index)}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 15,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {item.question}
              </Text>
              <AntDesign
                name={activeIndex === index ? "up" : "down"}
                size={18}
                color="black"
              />
            </TouchableOpacity>

            <Animated.View
              style={{ overflow: "hidden", height: heightInterpolation }}
            >
              <Text style={{ paddingVertical: 10, fontSize: 14 }}>
                {item.answer}
              </Text>
            </Animated.View>
          </View>
        );
      })}
      {/* Contact Section */}
      <View style={{ marginTop: 40, paddingVertical: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
          Need More Help?
        </Text>
        <Text style={{ fontSize: 16, color: "#555", marginBottom: 20 }}>
          We’re here to assist you! Contact us via WhatsApp or Call.
        </Text>

        {/* WhatsApp Contact */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            padding: 12,
            marginBottom: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
          }}
          onPress={handleWhatsApp}
        >
          <FontAwesome name="whatsapp" size={30} color="#25D366" />
          <Text style={{ fontSize: 18, marginLeft: 15, flex: 1 }}>
            WhatsApp us
          </Text>
          <MaterialIcons name="open-in-new" size={24} color="gray" />
        </TouchableOpacity>

        {/* Call Contact */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            padding: 12,
            marginBottom: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
          }}
          onPress={handleCall}
        >
          <FontAwesome name="phone" size={30} color="gray" />
          <Text style={{ fontSize: 18, marginLeft: 15, flex: 1 }}>Call us</Text>
          <MaterialIcons name="open-in-new" size={24} color="gray" />
        </TouchableOpacity>
        {/* Email Contact */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            padding: 12,
            marginBottom: 40,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
          }}
          onPress={handleEmail}
        >
          <FontAwesome name="envelope" size={28} color="#EA4335" />
          <Text className="text-lg flex-1 ml-4">Email us</Text>
          <MaterialIcons name="open-in-new" size={24} color="gray" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FAQs;
