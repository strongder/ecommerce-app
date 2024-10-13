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
export const fetchUnreadNotifications: any = createAsyncThunk(
  "notifications/fetchUnreadNotifications",
  async () => {
    try {
      const response = await axiosInstance("/notifications/unread-count");
      return response.data.result;
    } catch (error) {
      console.log(error);
    }
  }
);
export const readNotification: any = createAsyncThunk(
  "notifications/readNotification",
  async (id: number) => {
    try {
      const response = await axiosInstance.put(`/notifications/read/${id}`);
      return id;
    } catch (error) {
      console.log(error);
    }
  }
);
const initialState: any = {
  notifications: [],
  unreadCount: 0,
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
      })
      .addCase(fetchUnreadNotifications.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(fetchUnreadNotifications.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.unreadCount = action.payload;
      })
      .addCase(readNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.map((noti: any) => {
          return noti.id === action.payload ? { ...noti, read: true } : noti;
        });
      });
  },
});
export default notiffiSlice.reducer;
