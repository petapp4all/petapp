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
  {
    id: "6",
    customerName: "Emmanuel Osei",
    fuelType: "LPG",
    quantity: "600L",
    price: "₦240,000",
    paymentStatus: "Paid",
    location: "78 Ring Road, Ibadan, Nigeria",
    deliveryDate: "2025-03-18",
    status: "Pending",
    time: getRandomTime(),
  },
  {
    id: "7",
    customerName: "Chinwe Eze",
    fuelType: "Biodiesel",
    quantity: "350L",
    price: "₦140,000",
    paymentStatus: "Paid",
    location: "33 Aba Road, Enugu, Nigeria",
    deliveryDate: "2025-03-24",
    status: "Pending",
    time: getRandomTime(),
  },
  {
    id: "8",
    customerName: "Paul Anderson",
    fuelType: "Ethanol",
    quantity: "700L",
    price: "₦280,000",
    paymentStatus: "Pending",
    location: "9 Eket Street, Uyo, Nigeria",
    deliveryDate: "2025-03-25",
    status: "Pending",
    time: getRandomTime(),
  },
  {
    id: "9",
    customerName: "Rebecca Adams",
    fuelType: "Jet Fuel",
    quantity: "900L",
    price: "₦720,000",
    paymentStatus: "Paid",
    location: "77 Olusegun Obasanjo Way, Kaduna, Nigeria",
    deliveryDate: "2025-03-26",
    status: "Pending",
    time: getRandomTime(),
  },
  {
    id: "10",
    customerName: "Ibrahim Lawal",
    fuelType: "Diesel",
    quantity: "1200L",
    price: "₦600,000",
    paymentStatus: "Pending",
    location: "50 Airport Road, Kano, Nigeria",
    deliveryDate: "2025-03-27",
    status: "Pending",
    time: getRandomTime(),
  },
  {
    id: "11",
    customerName: "Grace Obinna",
    fuelType: "Petrol",
    quantity: "800L",
    price: "₦400,000",
    paymentStatus: "Paid",
    location: "18 Ikot Ekpene Road, Calabar, Nigeria",
    deliveryDate: "2025-03-28",
    status: "Pending",
    time: getRandomTime(),
  },
  {
    id: "12",
    customerName: "Michael Eze",
    fuelType: "Kerosene",
    quantity: "250L",
    price: "₦100,000",
    paymentStatus: "Pending",
    location: "22 Niger Street, Onitsha, Nigeria",
    deliveryDate: "2025-03-29",
    status: "Pending",
    time: getRandomTime(),
  },
];
