import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CURRENT_USER } from "@/lib/constants";
import { UserProfile } from "@/lib/types";

interface AccountState {
  user: UserProfile;
  security: {
    twoFactorEnabled: boolean;
    loginAlertsEnabled: boolean;
    sessionTimeoutMinutes: number;
  };
  preferences: {
    themeMode: "dark" | "light";
    notificationsEmail: boolean;
    notificationsPush: boolean;
  };
}

const initialState: AccountState = {
  user: CURRENT_USER,
  security: {
    twoFactorEnabled: true,
    loginAlertsEnabled: true,
    sessionTimeoutMinutes: 30,
  },
  preferences: {
    themeMode: "dark",
    notificationsEmail: true,
    notificationsPush: true,
  },
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.user = { ...state.user, ...action.payload };
    },
    toggleTwoFactor: (state) => {
      state.security.twoFactorEnabled = !state.security.twoFactorEnabled;
    },
    updatePreferences: (state, action: PayloadAction<Partial<AccountState["preferences"]>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
  },
});

export const { updateProfile, toggleTwoFactor, updatePreferences } = accountSlice.actions;

export default accountSlice.reducer;
