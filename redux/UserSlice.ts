import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api";

export const fetchCurrentUser: any= createAsyncThunk(
  "User/fetchCurrentUser",
  async () => {
    try {
      const response = await axiosInstance.get("/users/current-user");
      return response.data.result;
    } catch (error) {
      console.log("Get current user fail:", error);
    }
  }
);

const initialState = {
  currentUser: {},
  loading: "idle",
};
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.currentUser = action.payload;
      state.loading = "succeeded";
    });
  },
});

export default userSlice.reducer;