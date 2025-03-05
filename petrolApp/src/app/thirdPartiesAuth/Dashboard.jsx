// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import auth from "@react-native-firebase/auth";
// import { useNavigation } from "@react-navigation/native";

// export default function Dashboard() {
//   const navigation = useNavigation();

//   const handleLogout = async () => {
//     try {
//       await auth().signOut();
//       // Reset the navigation stack to 'Login' and remove the OTP-related screens
//       navigation.reset({
//         index: 0,
//         routes: [{ name: "index" }],
//       });
//     } catch (error) {
//       console.log("Logout Error:", error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome to Dashboard</Text>
//       <TouchableOpacity onPress={handleLogout} style={styles.button}>
//         <Text style={styles.buttonText}>Logout</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: "red",
//     padding: 15,
//     borderRadius: 10,
//   },
//   buttonText: {
//     color: "white",
//     fontSize: 18,
//   },
// });
