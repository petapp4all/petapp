import { configureStore } from "@reduxjs/toolkit";
import orderReducer from "./slices/ordersSlice";
import userReducer from "./slices/userSlice";
import stationReducer from "./slices/stationSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
    orders: orderReducer,
    stations: stationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
