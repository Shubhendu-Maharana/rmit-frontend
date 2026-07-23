import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DatabaseUser } from "@app/types/users";

export interface AuthState {
  token: string | null;
  user: DatabaseUser | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: DatabaseUser; token: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, clearCredentials, setLoading } =
  authSlice.actions;

export default authSlice.reducer;
