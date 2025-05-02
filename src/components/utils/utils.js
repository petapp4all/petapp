import Constants from "expo-constants";
import { QueryClient } from "@tanstack/react-query";
import { supportedCpuArchitectures } from "expo-device";

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
    pms: 830,
    ago: 1028,
    address: "123 Ikorodu Road, Lagos",
    supportedOrdering: "no",
    email: "info@menjoil.com",
    operatingHours: "6 AM - 10 PM",
    availableProducts: ["PMS", "AGO", "LPG"],

    paymentMethods: ["Cash", "POS", "Bank Transfer"],
    facilities: ["ATM", "Car Wash", "Convenience Store"],
    stationType: "Independent Marketer",
  },
  {
    id: "2",
    name: "Matrix Energy (Warri)",
    logo: require("@/assets/images/matrix-energy-logo.png"),
    lastUpdated: "1 hour ago",

    pms: 857,
    ago: null,
    address: "456 Warri Road, Delta State",
    supportedOrdering: "no",
    email: "support@matrixenergy.com",
    operatingHours: "24 Hours",
    availableProducts: ["PMS", "AGO"],
    paymentMethods: ["Cash", "POS"],
    facilities: ["Restrooms", "Restaurant", "Lounge"],
    stationType: "Major Marketer",
  },
  {
    id: "3",
    name: "Africa Terminals Nig. Ltd. (Lagos)",
    logo: require("@/assets/images/africa-terminals-logo.png"),
    lastUpdated: "7 hours ago",

    pms: null,
    ago: 1033,
    address: "789 Terminal Road, Lagos",
    supportedOrdering: "no",
    email: "info@africaterminals.com",
    operatingHours: "5 AM - 11 PM",
    availableProducts: ["AGO"],

    paymentMethods: ["POS", "Bank Transfer"],
    facilities: ["Fuel Storage", "Logistics Services"],
    stationType: "Bulk Supplier",
  },
  {
    id: "4",
    name: "TotalEnergies (Abuja)",
    logo: require("@/assets/images/total-logo.jpeg"),
    lastUpdated: "3 hours ago",
    pms: 850,
    ago: 1040,
    address: "10 Airport Road, Abuja",
    supportedOrdering: "no",
    email: "customer@total.com",
    operatingHours: "24 Hours",
    availableProducts: ["PMS", "AGO", "LPG"],

    paymentMethods: ["Cash", "POS", "Mobile Payment"],
    facilities: ["Cafe", "Car Repair Service"],
    stationType: "Major Marketer",
  },
  {
    id: "5",
    name: "Oando Plc (Lagos)",
    logo: require("@/assets/images/oando-logo.png"),
    lastUpdated: "5 hours ago",

    pms: 845,
    ago: null,
    address: "22 Lekki Expressway, Lagos",
    supportedOrdering: "no",
    email: "info@oandoplc.com",
    operatingHours: "6 AM - 9 PM",
    availableProducts: ["PMS", "AGO"],

    paymentMethods: ["Cash", "POS"],
    facilities: ["Car Wash", "Restrooms"],
    stationType: "Major Marketer",
  },
  {
    id: "6",
    name: "Conoil (Port Harcourt)",
    logo: require("@/assets/images/conoil-logo.png"),
    lastUpdated: "2 hours ago",

    pms: 860,
    ago: 1050,
    address: "35 Aba Road, Port Harcourt",
    supportedOrdering: "yes",
    email: "support@conoil.com",
    operatingHours: "5 AM - 11 PM",
    availableProducts: ["PMS", "AGO", "LPG"],

    paymentMethods: ["Cash", "POS", "Bank Transfer"],
    facilities: ["Lounge", "Mechanic Workshop"],
    stationType: "Independent Marketer",
  },
  {
    id: "7",
    name: "MRS Oil (Ibadan)",
    logo: require("@/assets/images/mrs-logo.png"),
    lastUpdated: "1 hour ago",

    pms: 840,
    ago: null,
    address: "19 Ring Road, Ibadan",
    supportedOrdering: "yes",
    email: "info@mrsoil.com",
    operatingHours: "6 AM - 10 PM",
    availableProducts: ["PMS", "AGO"],
    paymentMethods: ["Cash", "POS", "Mobile Wallet"],
    facilities: ["Convenience Store", "Car Service"],
    stationType: "Major Marketer",
  },
  {
    id: "8",
    name: "Eterna Plc (Kano)",
    logo: require("@/assets/images/eterna-logo.png"),
    lastUpdated: "4 hours ago",

    pms: 855,
    ago: 1025,
    address: "44 Kano Road, Kano",
    supportedOrdering: "yes",
    email: "info@eternaplc.com",
    operatingHours: "7 AM - 10 PM",
    availableProducts: ["PMS", "AGO"],

    paymentMethods: ["POS", "Bank Transfer"],
    facilities: ["Rest Area", "Food Court"],
    stationType: "Independent Marketer",
  },
];
