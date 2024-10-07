import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api";
import { Alert } from "react-native";

export const fetchCart: any = createAsyncThunk(
    "cart/fetchCart",
    async (userId: number) => {
        try {
        const response = await axiosInstance.get(`/carts/${userId}`);
        return response.data.result;
        } catch (error) {
        console.log("Get cart fail:", error);
        }
    }
);

export const addProductToCart: any = createAsyncThunk(
    "cart/addProduct",
    async ({userId, data}: any) => {
        try {
        const response = await axiosInstance.post(`/carts/${userId}`, data);
        return response.data.result;
        } catch (error: any) {
         console.log("Add product to cart fail:", error.response.data);
         if (error.response.data.code === 1005) {
            Alert.alert("Thông báo", "Kho hàng không đủ sản phẩm"); 
            return;
         }
        }
    }
);
export const removeProductFromCart: any = createAsyncThunk(
    "cart/removeProduct",
    async ({ param }: any) => {
        try {
            // Sử dụng params để truyền query parameters
            const response = await axiosInstance.put(`/carts/remove-cart-item`, null,{
                params: param  // Truyền các tham số dưới dạng query parameters
            });
            return response.data.result;
        } catch (error) {
            console.log("Remove product from cart fail:", error);
        }
    }
);

export const updateProductInCart: any = createAsyncThunk(
    "cart/updateProduct",
    async ({ param }: any) => {
        try {
            // Sử dụng params để truyền query parameters
            const response = await axiosInstance.put(`/carts/update-cart-item`, null, {
                params: param  // Truyền các tham số dưới dạng query parameters
            });
            return response.data.result;
        } catch (error) {
            console.log("Update product in cart fail:", error);
        }
    }
);


const initialState: any = {
    cart: {},
    loading: "idle",
};

const cartSlice = createSlice({
    name: "carts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.cart = action.payload;
                state.loading = "pending";
            })
            .addCase(addProductToCart.fulfilled, (state, action) => {
                state.cart = action.payload;
                state.loading = "succeeded";
            })
            .addCase(removeProductFromCart.fulfilled, (state, action) => {
                state.cart = action.payload;
                state.loading = "failed";
            })
            .addCase(updateProductInCart.fulfilled, (state, action) => {
                state.cart = action.payload;
                state.loading = "failed";
            });
    },
});

export default cartSlice.reducer;