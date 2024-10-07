import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api";

export const fetchProductById: any = createAsyncThunk(
    "products/fetchProductById",
    async (productId: number) => {
        try {
            const response = await axiosInstance.get(`/products/${productId}`);
            return response.data.result;
        } catch (error) {
            console.log("Get product fail:", error);
        }
    }
);
export const fetchProduct: any = createAsyncThunk(
    "products/fetchProduct",
    async () => {
        try {
            const response = await axiosInstance.get(`/public/products`);
            return response.data.result.content;
        } catch (error) {
            console.log("Get product fail:", error);
        }
    }
);
export const fetchProductByCategory: any = createAsyncThunk(
    "products/fetchProductByCategory",
    async (categoryId) => {
        try {
            const response = await axiosInstance.get(`/public/products/category/${categoryId}`);
            return response.data.result.content;
        } catch (error) {
            console.log("Get product fail:", error);
        }
    }
);
export const fetchProductBySearch: any = createAsyncThunk(
    "products/fetchProductBySearch",
    async (search: string) => {
        try {
            const response = await axiosInstance.get(`/products/search/${search}`);
            return response.data.result;
        } catch (error) {
            console.log("Get product fail:", error);
        }
    }
);



const initialState = {
    listProduct: [],
    listProductSearch: [],
    listProductByCategory: [],
    product: {},
    loading: "idle",
};

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.product = action.payload;
                state.loading = "succeeded";
            })
            .addCase(fetchProduct.fulfilled, (state, action) => {
                state.listProduct = action.payload;
                state.loading = "succeeded";
            })
            .addCase(fetchProductByCategory.fulfilled, (state, action) => {
                state.listProductByCategory = action.payload;
                state.loading = "succeeded";
            })
            .addCase(fetchProductBySearch.fulfilled, (state, action) => {
                state.listProductSearch = action.payload;
                state.loading = "succeeded";
            })
          
    },
});
export default productSlice.reducer;