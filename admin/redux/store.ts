import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import catalogReducer from "./slices/catalogSlice";
import inventoryReducer from "./slices/inventorySlice";
import uiReducer from "./slices/uiSlice";
import accountReducer from "./slices/accountSlice";
import analyticsReducer from "./slices/analyticsSlice";
import employeeReducer from "./slices/employeeSlice";
import orderReducer from "./slices/orderSlice";
import userOrderReducer from "./slices/userOrderSlice";
import storyReducer from "./slices/storySlice";

export const store = configureStore({
  reducer: {
    catalog: catalogReducer,
    inventory: inventoryReducer,
    ui: uiReducer,
    account: accountReducer,
    analytics: analyticsReducer,
    employee: employeeReducer,
    order: orderReducer,
    userOrder: userOrderReducer,
    story: storyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use typed hooks across the app instead of plain useDispatch and useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
