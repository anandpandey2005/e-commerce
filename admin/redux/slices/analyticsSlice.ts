import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MetricCard {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

interface AnalyticsState {
  period: "7d" | "30d" | "90d" | "1y";
  metrics: MetricCard[];
  isLoading: boolean;
}

const initialState: AnalyticsState = {
  period: "30d",
  metrics: [
    { id: "rev", title: "Total Revenue", value: "$128,450.00", change: "+14.2%", isPositive: true },
    { id: "orders", title: "Total Orders", value: "1,420", change: "+8.6%", isPositive: true },
    { id: "customers", title: "Active Customers", value: "3,890", change: "+12.1%", isPositive: true },
    { id: "aov", title: "Avg. Order Value", value: "$90.45", change: "-2.3%", isPositive: false },
  ],
  isLoading: false,
};

export const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setPeriod: (state, action: PayloadAction<AnalyticsState["period"]>) => {
      state.period = action.payload;
    },
    updateMetric: (state, action: PayloadAction<MetricCard>) => {
      const idx = state.metrics.findIndex((m) => m.id === action.payload.id);
      if (idx !== -1) {
        state.metrics[idx] = action.payload;
      }
    },
  },
});

export const { setPeriod, updateMetric } = analyticsSlice.actions;

export default analyticsSlice.reducer;
