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
