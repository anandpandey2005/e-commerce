import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MOCK_USER_ORDER_DETAIL } from "@/lib/constants";
import { CustomerUserDetail } from "@/lib/types";

interface UserOrderState {
  userOrderDetail: CustomerUserDetail;
}

const initialState: UserOrderState = {
  userOrderDetail: MOCK_USER_ORDER_DETAIL,
};

export const userOrderSlice = createSlice({
  name: "userOrder",
  initialState,
  reducers: {
    setUserOrderDetail: (state, action: PayloadAction<CustomerUserDetail>) => {
      state.userOrderDetail = action.payload;
    },
    updateUserOrderStatus: (
      state,
      action: PayloadAction<{ orderId: string; status: "Completed" | "Processing" | "Cancelled" }>
    ) => {
      const order = state.userOrderDetail.orders.find((o) => o.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
      }
    },
  },
});

export const { setUserOrderDetail, updateUserOrderStatus } = userOrderSlice.actions;

export default userOrderSlice.reducer;
