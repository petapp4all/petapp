// import { View, Text, SafeAreaView, Button, Platform } from "react-native";
// import React, { useEffect, useState } from "react";
// import { sha256 } from "react-native-sha256";
// import {
//   AccessToken,
//   AuthenticationToken,
//   LoginManager,
// } from "react-native-fbsdk-next";
// import auth from "@react-native-firebase/auth";

// const index = () => {
//   const [initializing, setInitializing] = useState(true);
//   const [user, setUser] = useState();

//   // Handle user state changes
//   function onAuthStateChanged(user) {
//     console.log(user);
//     setUser(user);
//     if (initializing) setInitializing(false);
//   }

//   useEffect(() => {
//     const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
//     return subscriber; // unsubscribe on unmount
//   }, []);

//   function generateNonce(length = 16) {
//     const characters =
//       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     let nonce = "";
//     for (let i = 0; i < length; i++) {
//       const randomIndex = Math.floor(Math.random() * characters.length);
//       nonce += characters[randomIndex];
//     }
//     return nonce;
//   }

//   async function onFacebookButtonPressIOS() {
//     // Create a nonce and the corresponding
//     // sha256 hash of the nonce
//     const nonce = generateNonce();
//     const nonceSha256 = await sha256(nonce);
//     // Attempt login with permissions and limited login
//     const result = await LoginManager.logInWithPermissions(
//       ["public_profile", "email"],
//       "limited",
//       nonceSha256
//     );

//     if (result.isCancelled) {
//       throw "User cancelled the login process";
//     }

//     // Once signed in, get the users AuthenticationToken
//     const data = await AuthenticationToken.getAuthenticationTokenIOS();

//     if (!data) {
//       throw "Something went wrong obtaining authentication token";
//     }

//     // Create a Firebase credential with the AuthenticationToken
//     // and the nonce (Firebase will validates the hash against the nonce)
//     const facebookCredential = auth.FacebookAuthProvider.credential(
//       data.authenticationToken,
//       nonce
//     );

//     // Sign-in the user with the credential
//     return auth().signInWithCredential(facebookCredential);
//   }

//   async function onFacebookButtonPressAndroid() {
//     // Attempt login with permissions
//     const result = await LoginManager.logInWithPermissions([
//       "public_profile",
//       "email",
//     ]);

//     if (result.isCancelled) {
//       throw "User cancelled the login process";
//     }

//     // Once signed in, get the users AccessToken
//     const data = await AccessToken.getCurrentAccessToken();

//     if (!data) {
//       throw "Something went wrong obtaining access token";
//     }

//     // Create a Firebase credential with the AccessToken
//     const facebookCredential = auth.FacebookAuthProvider.credential(
//       data.accessToken
//     );

//     // Sign-in the user with the credential
//     return auth().signInWithCredential(facebookCredential);
//   }

//   if (initializing) return null;

//   if (!user) {
//     return (
//       <SafeAreaView
//         style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
//       >
//         <Text>index</Text>
//         <Button
//           title="Facebook Sign-In"
//           onPress={
//             Platform.OS === "ios"
//               ? () =>
//                   onFacebookButtonPressIOS().then(() =>
//                     console.log("Signed in with Facebook!")
//                   )
//               : () =>
//                   onFacebookButtonPressAndroid().then(() =>
//                     console.log("Signed in with Facebook!")
//                   )
//           }
//         />
//         <Text>{Platform.OS}</Text>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView
//       style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
//     >
//       <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
//         Welcome
//       </Text>

//       {user &&
//         Object.entries(user).map(([key, value]) => (
//           <Text key={key} style={{ marginBottom: 10 }}>
//             {key}: {JSON.stringify(value)}
//           </Text>
//         ))}

//       <Button title="Sign out" onPress={() => auth().signOut()} />
//     </SafeAreaView>
//   );
// };

// export default index;
