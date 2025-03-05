// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity } from "react-native";
// import firestore from "@react-native-firebase/firestore";

// export default function Detail({ route, navigation }) {
//   const { uid } = route.params;
//   const [name, setName] = useState("");
//   const [dob, setDob] = useState("");
//   const [gender, setGender] = useState("");

//   const saveDetails = async () => {
//     try {
//       await firestore().collection("users").doc(uid).set({
//         name,
//         dob,
//         gender,
//       });

//       navigation.navigate("Dashboard");
//     } catch (error) {
//       console.log("Error saving details:", error);
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <TextInput
//         placeholder="Name"
//         value={name}
//         onChangeText={setName}
//         style={{ marginBottom: 10, borderWidth: 1, padding: 10 }}
//       />
//       <TextInput
//         placeholder="Date of Birth"
//         value={dob}
//         onChangeText={setDob}
//         style={{ marginBottom: 10, borderWidth: 1, padding: 10 }}
//       />
//       <TextInput
//         placeholder="Gender"
//         value={gender}
//         onChangeText={setGender}
//         style={{ marginBottom: 10, borderWidth: 1, padding: 10 }}
//       />
//       <TouchableOpacity
//         onPress={saveDetails}
//         style={{ backgroundColor: "blue", padding: 15 }}
//       >
//         <Text style={{ color: "white", textAlign: "center" }}>
//           Save Details
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// }
