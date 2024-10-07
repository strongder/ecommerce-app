import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api";
export const fetchNotifications: any = createAsyncThunk(
  "notifications/fetchNotifications",
  async () => {
    try {
      const response = await axiosInstance("/notifications");
      return response.data.result;
    } catch (error) {
      console.log(error);
    }
  }
);
const initialState = {
  notifications: [],
  loading: "idle",
  error: null,
};

const notiffiSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (buider) => {
    buider
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.notifications = action.payload;
      });
  },
});

export default notiffiSlice.reducer;