import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api";

export const fetchReviewByProduct: any = createAsyncThunk(
    "reviews/fetchReviewByProduct",
    async ({productId, param}: any) => {
        try {
            const response = await axiosInstance.get(`/reviews/product/${productId}`, { params: param });
            return response.data.result?.content;
        } catch (error) {
            console.log("Get review fail:", error);
        }
    }
);

export const createReview: any = createAsyncThunk(
    "reviews/createReview",
    async (data: any) => {
        try {
            const response = await axiosInstance.post(`/reviews`, data);
            return response.data.result;
        } catch (error) {
            console.log("Create review fail:", error);
        }
    }
);

const initialState: any = {
    reviews: [],
    review: {},
    loading: "idle",
};

const reviewSlice = createSlice({
    name: "reviews",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReviewByProduct.fulfilled, (state, action) => {
                state.reviews = [...state.reviews, ...action.payload];
                state.loading = "succeeded";
            })
            .addCase(createReview.fulfilled, (state, action) => {
                state.review = action.payload;
                state.loading = "succeeded";
            });
    },
});

export default reviewSlice.reducer;