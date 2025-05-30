Project Overview

PetrolApp is a comprehensive mobile application designed to help users efficiently manage their fuel-related activities.
Built with React Native (Expo) and powered by a Node.js/Express backend using MongoDB and Prisma ORM, the app offers the following key features:

       View the latest fuel prices in real time

       Locate the nearest filling stations using an interactive map

       Stay informed with the latest oil and gas news

       Order fuel directly from the app

       Advertise products or services related to the oil and gas industry

       Allow station owners to register and manage their fuel stations

PetrolApp bridges the gap between users and fuel service providers, creating a modern, user-friendly experience for both consumers and businesses in the petroleum sector.

<!-- Tech Stack -->

Frontend (React Native with Expo)

<!-- Backend -->

Node.js with Express
Prisma ORM (MongoDB)

npx prisma generate
npm run start

API_URL= https://petapp-black.vercel.app/api

Getting Started

 <!-- Frontend Setup -->

cd petrolApp
npm install
npx expo start

<!-- You need a development build to avoid any posible error as some library force the app to only works on real devices -->

 <!-- Backend Setup -->

cd backend
npm install
npx prisma generate
npm run dev

Third-Party Services & Dependencies

Frontend Dependencies
Library and their Purpose

@expo/vector-icons -----> Icons
@react-native-async-storage/async-storage -----> Local storage
@react-native-community/datetimepicker -----> Native date/time picker
@react-native-picker/picker -----> Dropdown picker
@react-navigation/bottom-tabs -----> Bottom tab navigation
@reduxjs/toolkit, react-redux -----> State management
@rnmapbox/maps -----> (Mapbox GL)
@tanstack/react-query -----> Async data fetching and caching
axios -----> HTTP client
date-fns -----> Date utility functions
expo-\* (image-picker, location, notifications, blur, updates, etc.) Expo's native modules
firebase -----> notifications
nativewind, tailwindcss -----> Tailwind styling in React Native
react-hook-form -----> Form validation
react-native-geolocation-service -----> High-accuracy location
react-native-paper -----> Material UI components
react-native-paystack-webview -----> In-app Paystack payments
react-native-webview -----> Embedded webviews

Backend Dependencies
Third-Party Services & Dependencies
Library and their Purpose
express -----> Web server
cors -----> Handle CORS
dotenv -----> Environment variables
bcryptjs -----> Password hashing
jsonwebtoken -----> Token-based auth
axios -----> Backend-to-backend API calls
prisma, @prisma/client -----> MongoDB ORM
cloudinary -----> Image uploads
nodemailer -----> Email sending
nanoid -----> Unique ID generation
date-fns -----> Date formatting
express-async-handler -----> Simplifies async error handling
nodemon -----> Auto-restarting dev server

Deployment
Frontend
Use EAS Build for production builds

Publish OTA updates via expo publish

Backend
Deploy using:
Vercel (for serverless)
