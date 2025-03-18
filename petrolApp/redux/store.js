import { configureStore } from "@reduxjs/toolkit";
import orderReducer from "./slices/ordersSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
    orders: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
