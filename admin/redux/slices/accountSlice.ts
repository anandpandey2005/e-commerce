import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CURRENT_USER } from "@/lib/constants";
import { UserProfile } from "@/lib/types";

const RAW_SERVER_URI =
  process.env.NEXT_PUBLIC_SERVER_URI ||
  process.env.SERVER_URI ||
  "http://localhost:2020/api/v1";

const SERVER_URI = RAW_SERVER_URI.replace(/\/+$/, "");

export interface AdminUser {
  _id: string;
  full_name: string;
  email: string;
  role: string;
  phone?: {
    country_code: string;
    number: string;
  };
}

interface AccountState {
  user: UserProfile;
  adminUser: AdminUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
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

const getInitialToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("admin_access_token");
  }
  return null;
};

const getInitialAdminUser = (): AdminUser | null => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("admin_user_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

const initialToken = getInitialToken();
const initialAdmin = getInitialAdminUser();

const initialState: AccountState = {
  user: CURRENT_USER,
  adminUser: initialAdmin,
  token: initialToken,
  refreshToken: typeof window !== "undefined" ? localStorage.getItem("admin_refresh_token") : null,
  isAuthenticated: !!initialToken,
  loading: false,
  error: null,
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

export const signInAdmin = createAsyncThunk(
  "account/signInAdmin",
  async (
    payload: {
      email: string;
      password: string;
      phone?: { country_code: string; number: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${SERVER_URI}/admin/account/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || "Invalid credentials or unauthorized account.");
      }

      const { access_token, refresh_token, admin } = data.data;

      if (typeof window !== "undefined") {
        if (access_token) localStorage.setItem("admin_access_token", access_token);
        if (refresh_token) localStorage.setItem("admin_refresh_token", refresh_token);
        if (admin) localStorage.setItem("admin_user_data", JSON.stringify(admin));
      }

      return { access_token, refresh_token, admin };
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error. Unable to communicate with authentication server.");
    }
  }
);

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    initializeAuth: (state) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("admin_access_token");
        const refreshToken = localStorage.getItem("admin_refresh_token");
        const adminDataStr = localStorage.getItem("admin_user_data");
        if (token) {
          state.token = token;
          state.refreshToken = refreshToken;
          state.isAuthenticated = true;
          if (adminDataStr) {
            try {
              state.adminUser = JSON.parse(adminDataStr);
            } catch (e) {
              // ignore
            }
          }
        }
      }
    },
    logoutAdmin: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.adminUser = null;
      state.isAuthenticated = false;
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin_access_token");
        localStorage.removeItem("admin_refresh_token");
        localStorage.removeItem("admin_user_data");
      }
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.user = { ...state.user, ...action.payload };
    },
    toggleTwoFactor: (state) => {
      state.security.twoFactorEnabled = !state.security.twoFactorEnabled;
    },
    updatePreferences: (state, action: PayloadAction<Partial<AccountState["preferences"]>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.token = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token || null;
        state.adminUser = action.payload.admin;
        state.isAuthenticated = true;
      })
      .addCase(signInAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Authentication failed.";
        state.isAuthenticated = false;
      });
  },
});

export const {
  initializeAuth,
  logoutAdmin,
  updateProfile,
  toggleTwoFactor,
  updatePreferences,
  clearAuthError,
} = accountSlice.actions;

export default accountSlice.reducer;
