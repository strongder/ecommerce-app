import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api";
import { orders } from "../data";


export const fetchOrderById: any = createAsyncThunk(
    "orders/fetchOrders",
    async (orderId: number) => {
        try {
            const response = await axiosInstance.get(`/orders/${orderId}`);
            return response.data.result;
        } catch (error) {
            console.log("Get orders fail:", error);
        }
    }
);
export const fetchOrderByUser: any = createAsyncThunk(
    "orders/fetchOrderByUser",
    async (userId: number) => {
        try {
            const response = await axiosInstance.get(`/orders/user/${userId}`);
            return response.data.result.content;
        } catch (error) {
            console.log("Get orders fail:", error);
        }
    }
);
export const placeOrder: any = createAsyncThunk(
    "orders/placeOrder",
    async ({data, param}: any) => {
        try {
            const response = await axiosInstance.post(`/orders`, data, {
                params: param
            });
            return response.data.result;
        } catch (error) {
            console.log("Create order fail:", error);
        }
    }
);
export const cancelOrder: any = createAsyncThunk(
    "orders/cancelOrder",
    async (orderId: number) => {
        try {
            const response = await axiosInstance.put(`/orders/cancel-order/${orderId}`);
            return response.data.result;
        } catch (error) {
            console.log("Cancel order fail:", error);
        }
    }
);
const initialState: any = {
    listOrderByUser:  [],
    order: {},
    loading: "idle",
};
const orderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.order = action.payload;
                state.loading = "succeeded";
            })
            .addCase(fetchOrderByUser.fulfilled, (state, action) => {
                state.listOrderByUser = action.payload;
                state.loading = "succeeded";
            })
            .addCase(placeOrder.fulfilled, (state, action) => {
                state.listOrderByUser.push(action.payload);
                state.loading = "succeeded";
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.order = action.payload;   
            });
    },
});

export default orderSlice.reducer;