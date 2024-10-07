import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../api";

// First, create the thunk
interface LoginType {
    email: string;
    password: string;
    }
export const login: any = createAsyncThunk(
  "auth/login",
  async (authRequest: LoginType) => {
    try {
      const response = await axiosInstance.post(
        "/auth/user/login",
        authRequest
      );
      const token = response.data.token;
      const refreshToken = response.data.refreshToken;
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("refreshToken", refreshToken);
      return response.data;
    } catch (error) {
      console.log("check",error);
    }
  }
);


interface AuthState {
    token: string | null; // Cho phép null
    refreshToken: string | null; // Cho phép null
    loading: string
}
const initialState: AuthState = {
  token: AsyncStorage.getItem("token")+'' || null,
  refreshToken: AsyncStorage.getItem("refreshToken")+'' || null,
  loading: "idle",
};

// Then, handle actions in your reducers:
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // standard reducer logic, with auto-generated action types per reducer
    logout: (state) => {
        state.token = null;
        state.refreshToken = null;
        AsyncStorage.removeItem("token");
        AsyncStorage.removeItem("refreshToken");
     },
  },
  extraReducers: (builder) => {
    builder
        .addCase(login.pending, (state) => {
            state.loading = "pending";
        })
        .addCase(login.fulfilled, (state, action) => {
            state.loading = "succeeded";
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
        })
  },
});

export const { logout }: any = authSlice.actions;
export default authSlice.reducer;
