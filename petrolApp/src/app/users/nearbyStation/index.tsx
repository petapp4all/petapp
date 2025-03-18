import { View, Text } from "react-native";
import React from "react";

const nearbyStation = () => {
  return (
    <View>
      <Text className="bg-red-500 font-bold">nearbyStation</Text>
    </View>
  );
};

export default nearbyStation;

// When building petrol app with react-native and node.js, I need to implement locating nearby station in our app do I don't know, how the thing can be easier for me.
// ChatGPT said:

// To implement a nearby petrol station locator in your React Native app with a Node.js backend, follow these steps:
// 1. Get User Location in React Native

// Use react-native-geolocation-service or Expo’s Location API to get the user's current location.
// Installation

// npm install react-native-geolocation-service

// Get User’s Coordinates

// import Geolocation from 'react-native-geolocation-service';

// const getUserLocation = () => {
//   Geolocation.getCurrentPosition(
//     (position) => {
//       console.log(position.coords.latitude, position.coords.longitude);
//     },
//     (error) => console.log(error),
//     { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//   );
// };

// 2. Use Google Places API to Find Nearby Petrol Stations

// You can use Google Places API to fetch petrol stations near the user's location.
// Get Google API Key

//     Go to Google Cloud Console
//     Enable Google Places API & Maps JavaScript API
//     Generate an API Key

// Make API Request to Google Places

// const fetchNearbyStations = async (latitude, longitude) => {
//   const API_KEY = 'YOUR_GOOGLE_API_KEY';
//   const radius = 5000; // 5km radius
//   const type = 'gas_station';

//   const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${API_KEY}`;

//   try {
//     const response = await fetch(url);
//     const data = await response.json();
//     console.log(data.results); // List of petrol stations
//   } catch (error) {
//     console.error(error);
//   }
// };

// 3. Display Petrol Stations on Map

// Use react-native-maps to display stations.
// Install react-native-maps

// npm install react-native-maps

// Render Map with Stations

// import React, { useState, useEffect } from 'react';
// import { View } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';

// const PetrolStationsMap = ({ stations }) => {
//   return (
//     <MapView
//       style={{ flex: 1 }}
//       initialRegion={{
//         latitude: stations[0]?.geometry.location.lat,
//         longitude: stations[0]?.geometry.location.lng,
//         latitudeDelta: 0.05,
//         longitudeDelta: 0.05,
//       }}
//     >
//       {stations.map((station, index) => (
//         <Marker
//           key={index}
//           coordinate={{
//             latitude: station.geometry.location.lat,
//             longitude: station.geometry.location.lng,
//           }}
//           title={station.name}
//         />
//       ))}
//     </MapView>
//   );
// };

// 4. Backend with Node.js (Optional)

// If you need to store & filter stations in your database, create a backend in Node.js.
// Install Express & Axios

// npm install express axios cors dotenv

// Backend API to Fetch Petrol Stations

// const express = require('express');
// const axios = require('axios');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.get('/api/nearby-stations', async (req, res) => {
//   const { lat, lng } = req.query;
//   const API_KEY = process.env.GOOGLE_API_KEY;
//   const radius = 5000; // 5km

//   const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=gas_station&key=${API_KEY}`;

//   try {
//     const response = await axios.get(url);
//     res.json(response.data.results);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Summary

// ✅ Get user location using react-native-geolocation-service
// ✅ Fetch petrol stations using Google Places API
// ✅ Display stations on a map using react-native-maps
// ✅ (Optional) Create a Node.js backend to store and filter stations

// Would you like me to guide you on implementing any of these steps in detail? 🚀
