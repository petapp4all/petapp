import { createSlice } from "@reduxjs/toolkit";
import { orders } from "@/src/components/utils/utils";

const initialState = {
  orders: orders,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    approveOrder: (state, action) => {
      state.orders = state.orders.map((order) =>
        order.id === action.payload ? { ...order, status: "Approved" } : order
      );
    },
    rejectOrder: (state, action) => {
      state.orders = state.orders.filter(
        (order) => order.id !== action.payload
      );
    },
  },
});

export const { setOrders, approveOrder, rejectOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
