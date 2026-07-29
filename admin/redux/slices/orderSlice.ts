import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface OrderItem {
  id: string;
  customerName: string;
  email: string;
  totalAmount: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
  itemsCount: number;
}

interface OrderState {
  orders: OrderItem[];
  selectedStatusFilter: string;
}

const initialState: OrderState = {
  orders: [
    { id: "ORD-9481", customerName: "Sarah Jenkins", email: "sarah.j@example.com", totalAmount: 349.49, status: "Processing", date: "Jul 28, 2026", itemsCount: 2 },
    { id: "ORD-9480", customerName: "David Miller", email: "david.m@example.com", totalAmount: 129.99, status: "Shipped", date: "Jul 28, 2026", itemsCount: 1 },
    { id: "ORD-9479", customerName: "Elena Rostova", email: "elena.r@example.com", totalAmount: 899.00, status: "Delivered", date: "Jul 27, 2026", itemsCount: 3 },
    { id: "ORD-9478", customerName: "Marcus Vance", email: "marcus.v@example.com", totalAmount: 49.00, status: "Cancelled", date: "Jul 26, 2026", itemsCount: 1 },
  ],
  selectedStatusFilter: "all",
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    updateOrderStatus: (state, action: PayloadAction<{ id: string; status: OrderItem["status"] }>) => {
      const order = state.orders.find((o) => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
      }
    },
    setSelectedStatusFilter: (state, action: PayloadAction<string>) => {
      state.selectedStatusFilter = action.payload;
    },
  },
});

export const { updateOrderStatus, setSelectedStatusFilter } = orderSlice.actions;

export default orderSlice.reducer;
