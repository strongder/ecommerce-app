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

export const fetchParentCategory: any = createAsyncThunk(
  "categories/fetchParentCategory",
  async () => {
    try {
      const response = await axiosInstance.get(`/public/categories/parent`);
      return response.data.result;
    } catch (error) {
      console.log("Get category fail:", error);
    }
  }
);
export const fetchParentCategoryById: any = createAsyncThunk(
  "categories/fetchParentCategoryById",
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
// export const fetchCategoryById: any = createAsyncThunk(
//   "categories/fetchChildCategoryById",
//   async (categoryId: number) => {
//     try {
//       const response = await axiosInstance.get(
//         `/public/categories/${categoryId}`
//       );
//       return response.data.result;
//     } catch (error) {
//       console.log("Get category fail:", error);
//     }
//   }
// );

const initialState = {
  categories: [],
  parentCategories: [],
  subCategories: [],
  subCategor:{},
  parentCategory: {},
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
      .addCase(fetchParentCategoryById.fulfilled, (state, action) => {
        state.parentCategory = action.payload;
        state.subCategories = action.payload.subCategories;
        state.loading = "succeeded";
      })
      .addCase(fetchParentCategory.fulfilled, (state, action) => {
        state.parentCategories = action.payload;
        state.loading = "succeeded";
      });
  },
});

export default categorySlice.reducer;
