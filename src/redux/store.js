import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import stationReducer from "./slices/stationSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
    stations: stationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
