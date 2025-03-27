import Constants from "expo-constants";
import { QueryClient } from "@tanstack/react-query";

const isDevelopment = __DEV__;
const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};

export const apiUrl = isDevelopment
  ? extra.apiUrlDevelopment || "http://localhost:8000/api"
  : extra.apiUrlProduction || "https://petrol-auth.vercel.app/api";

export const queryClient = new QueryClient();

export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

const names = [
  "Peter Sunday",
  "Mathew Adeyemi",
  "Grace Johnson",
  "Emeka Okafor",
  "Aisha Bello",
  "David Ibrahim",
  "Esther Olamide",
  "John Chinedu",
  "Mariam Yusuf",
  "Samuel Eze",
  "Victoria Adebayo",
  "Ahmed Musa",
  "Sophia Onyekachi",
  "Daniel Obinna",
  "Chioma Nwankwo",
  "Michael Ojo",
  "Blessing Edet",
  "Elijah Olatunji",
  "Fatima Danladi",
  "Christopher Umeh",
];

const emails = [
  "petersunday@gmail.com",
  "mathewadeyemi@yahoo.com",
  "gracejohnson@hotmail.com",
  "emekaokafor@outlook.com",
  "aishabello@gmail.com",
  "davidibrahim@yahoo.com",
  "estherolamide@live.com",
  "johnchinedu@gmail.com",
  "mariamyusuf@yahoo.com",
  "samueleze@hotmail.com",
  "victoriaadebayo@outlook.com",
  "ahmedmusa@gmail.com",
  "sophiaonyekachi@yahoo.com",
  "danielobinna@live.com",
  "chiomanwankwo@gmail.com",
  "michaelojo@yahoo.com",
  "blessingedet@hotmail.com",
  "elijaholatunji@outlook.com",
  "fatimadanladi@gmail.com",
  "christopherumeh@yahoo.com",
];

export const userData = names.map((name, index) => ({
  id: (index + 1).toString().padStart(3, "0"),
  name,
  email: emails[index],
  phone: `0812${Math.floor(1000000 + Math.random() * 9000000)}`,
  address: `${index + 1} Example Street, City ${(index % 5) + 1}, Nigeria`,
  totalTransactions: Math.floor(5 + Math.random() * 20),
  lastActive: `2025-03-${String(10 + (index % 5)).padStart(2, "0")} ${String(
    8 + (index % 12)
  ).padStart(2, "0")}:30`,
  registeredDate: `2024-0${Math.floor(1 + Math.random() * 9)}-${String(
    10 + (index % 15)
  ).padStart(2, "0")}`,
  status: index % 3 === 0 ? "Inactive" : "Active",
  transactionHistory: [
    {
      date: `2025-03-${String(10 + (index % 5)).padStart(2, "0")}`,
      amount: Math.floor(1000 + Math.random() * 10000),
      paymentMethod: [
        "Credit Card",
        "Debit Card",
        "Bank Transfer",
        "Mobile Payment",
      ][index % 4],
      status: index % 4 === 0 ? "Pending" : "Completed",
    },
  ],
  loyaltyRewards: {
    pointsEarned: Math.floor(50 + Math.random() * 200),
    redeemedRewards: [
      "₦500 Discount",
      "₦1000 Discount",
      "Free Car Wash",
      "Free Fuel Delivery",
    ].slice(0, (index % 3) + 1),
  },
  fuelDeliveryRequests: {
    pending: index % 4,
    completed: Math.floor(5 + Math.random() * 15),
    cancelled: index % 3,
  },
  notificationsSent: {
    push: Math.floor(2 + Math.random() * 10),
    email: Math.floor(5 + Math.random() * 12),
  },
}));

export const stations = [
  {
    id: "1",
    name: "Menj Oil (Lagos)",
    logo: require("@/assets/images/menj-oil-logo.jpeg"),
    lastUpdated: "6 hours ago",

    rating: 4.2,
    pms: 830,
    ago: 1028,
    address: "123 Ikorodu Road, Lagos",
    contactNumber: "+234 801 234 5678",
    email: "info@menjoil.com",
    operatingHours: "6 AM - 10 PM",
    availableProducts: ["PMS", "AGO", "LPG"],
    queueStatus: "Short",
    paymentMethods: ["Cash", "POS", "Bank Transfer"],
    facilities: ["ATM", "Car Wash", "Convenience Store"],
    stationType: "Independent Marketer",
  },
  {
    id: "2",
    name: "Matrix Energy (Warri)",
    logo: require("@/assets/images/matrix-energy-logo.png"),
    lastUpdated: "1 hour ago",

    rating: 4.5,
    pms: 857,
    ago: null,
    address: "456 Warri Road, Delta State",
    contactNumber: "+234 802 345 6789",
    email: "support@matrixenergy.com",
    operatingHours: "24 Hours",
    availableProducts: ["PMS", "AGO"],
    queueStatus: "Long",
    paymentMethods: ["Cash", "POS"],
    facilities: ["Restrooms", "Restaurant", "Lounge"],
    stationType: "Major Marketer",
  },
  {
    id: "3",
    name: "Africa Terminals Nig. Ltd. (Lagos)",
    logo: require("@/assets/images/africa-terminals-logo.png"),
    lastUpdated: "7 hours ago",

    rating: 4.0,
    pms: null,
    ago: 1033,
    address: "789 Terminal Road, Lagos",
    contactNumber: "+234 803 456 7890",
    email: "info@africaterminals.com",
    operatingHours: "5 AM - 11 PM",
    availableProducts: ["AGO"],
    queueStatus: "Medium",
    paymentMethods: ["POS", "Bank Transfer"],
    facilities: ["Fuel Storage", "Logistics Services"],
    stationType: "Bulk Supplier",
  },
  {
    id: "4",
    name: "TotalEnergies (Abuja)",
    logo: require("@/assets/images/total-logo.jpeg"),
    lastUpdated: "3 hours ago",

    rating: 4.8,
    pms: 850,
    ago: 1040,
    address: "10 Airport Road, Abuja",
    contactNumber: "+234 804 567 8901",
    email: "customer@total.com",
    operatingHours: "24 Hours",
    availableProducts: ["PMS", "AGO", "LPG"],
    queueStatus: "Short",
    paymentMethods: ["Cash", "POS", "Mobile Payment"],
    facilities: ["Cafe", "Car Repair Service"],
    stationType: "Major Marketer",
  },
  {
    id: "5",
    name: "Oando Plc (Lagos)",
    logo: require("@/assets/images/oando-logo.png"),
    lastUpdated: "5 hours ago",

    rating: 4.3,
    pms: 845,
    ago: null,
    address: "22 Lekki Expressway, Lagos",
    contactNumber: "+234 805 678 9012",
    email: "info@oandoplc.com",
    operatingHours: "6 AM - 9 PM",
    availableProducts: ["PMS", "AGO"],
    queueStatus: "Medium",
    paymentMethods: ["Cash", "POS"],
    facilities: ["Car Wash", "Restrooms"],
    stationType: "Major Marketer",
  },
  {
    id: "6",
    name: "Conoil (Port Harcourt)",
    logo: require("@/assets/images/conoil-logo.png"),
    lastUpdated: "2 hours ago",

    rating: 4.6,
    pms: 860,
    ago: 1050,
    address: "35 Aba Road, Port Harcourt",
    contactNumber: "+234 806 789 0123",
    email: "support@conoil.com",
    operatingHours: "5 AM - 11 PM",
    availableProducts: ["PMS", "AGO", "LPG"],
    queueStatus: "Short",
    paymentMethods: ["Cash", "POS", "Bank Transfer"],
    facilities: ["Lounge", "Mechanic Workshop"],
    stationType: "Independent Marketer",
  },
  {
    id: "7",
    name: "MRS Oil (Ibadan)",
    logo: require("@/assets/images/mrs-logo.png"),
    lastUpdated: "1 hour ago",

    rating: 4.1,
    pms: 840,
    ago: null,
    address: "19 Ring Road, Ibadan",
    contactNumber: "+234 807 890 1234",
    email: "info@mrsoil.com",
    operatingHours: "6 AM - 10 PM",
    availableProducts: ["PMS", "AGO"],
    queueStatus: "Long",
    paymentMethods: ["Cash", "POS", "Mobile Wallet"],
    facilities: ["Convenience Store", "Car Service"],
    stationType: "Major Marketer",
  },
  {
    id: "8",
    name: "Eterna Plc (Kano)",
    logo: require("@/assets/images/eterna-logo.png"),
    lastUpdated: "4 hours ago",

    rating: 4.4,
    pms: 855,
    ago: 1025,
    address: "44 Kano Road, Kano",
    contactNumber: "+234 808 901 2345",
    email: "info@eternaplc.com",
    operatingHours: "7 AM - 10 PM",
    availableProducts: ["PMS", "AGO"],
    queueStatus: "Medium",
    paymentMethods: ["POS", "Bank Transfer"],
    facilities: ["Rest Area", "Food Court"],
    stationType: "Independent Marketer",
  },
];

const getRandomTime = () => {
  const now = new Date();
  const randomOffset = Math.floor(Math.random() * 24 * 60 * 60 * 1000);
  return new Date(now.getTime() - randomOffset);
};

export const orders = [
  {
    id: "1",
    customerName: "John Doe",
    fuelType: "Diesel",
    quantity: "500L",
    price: "₦250,000",
    paymentStatus: "Paid",
    location: "23 Ikorodu Road, Lagos, Nigeria",
    deliveryDate: "2025-03-20",
    status: "Pending",
    time: getRandomTime(),
  },
  {
    id: "2",
    customerName: "Jane Smith",
    fuelType: "Petrol",
    quantity: "1000L",
    price: "₦500,000",
    paymentStatus: "Pending",
    location: "10 Garki Street, Abuja, Nigeria",
    deliveryDate: "2025-03-21",
    status: "Pending",
    time: getRandomTime(),
  },
  {
    id: "3",
    customerName: "David Johnson",
    fuelType: "Kerosene",
    quantity: "300L",
    price: "₦120,000",
    paymentStatus: "Paid",
    location: "45 Trans Amadi Road, Port Harcourt, Nigeria",
    deliveryDate: "2025-03-19",
    status: "Pending",
    time: getRandomTime(),
  },
  {
    id: "4",
    customerName: "Samuel Okonkwo",
    fuelType: "Diesel",
    quantity: "750L",
    price: "₦375,000",
    paymentStatus: "Paid",
    location: "12 Allen Avenue, Ikeja, Lagos, Nigeria",
    deliveryDate: "2025-03-22",
    status: "Pending",
    time: getRandomTime(),
  },
  {
    id: "5",
    customerName: "Aisha Bello",
    fuelType: "Gasoline",
    quantity: "450L",
    price: "₦180,000",
    paymentStatus: "Pending",
    location: "5 Wuse Market Road, Abuja, Nigeria",
    deliveryDate: "2025-03-23",
    status: "Pending",
    time: getRandomTime(),
  },
];
