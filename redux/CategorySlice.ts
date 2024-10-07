import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api";

export const fetchCategory: any = createAsyncThunk(
  "categories/fetchCategory",
  async () => {
    try {
      const response = await axiosInstance.get(`/public/categories`);
      return response.data.result;
    } catch (error) {
      console.log("Get category fail:", error);
    }
  }
);
export const fetchCategoryById: any = createAsyncThunk(
  "categories/fetchCategoryById",
  async (categoryId: number) => {
    try {
      const response = await axiosInstance.get(
        `/public/categories/${categoryId}`
      );
      return response.data.result;
    } catch (error) {
      console.log("Get category fail:", error);
    }
  }
);

const initialState = {
  categories: [],
  category: {},
  loading: "idle",
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = "succeeded";
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.category = action.payload;
        state.loading = "succeeded";
      });
  },
});

export default categorySlice.reducer;
