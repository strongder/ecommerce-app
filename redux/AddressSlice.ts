import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api";

export const fetchAddressByUser: any = createAsyncThunk(
  "address/fetchAddress",
  async (userId: number) => {
    try {
      const response = await axiosInstance.get(`/addresses/user/${userId}`);
      return response.data.result;
    } catch (error) {
      console.log("Get address fail:", error);
    }
  }
);
export const addAddress: any = createAsyncThunk(
  "address/addAddress",
  async (data: any) => {
    try {
      const response = await axiosInstance.post(`/addresses`, data);
      return response.data.result;
    } catch (error) {
      console.log("Add address fail:", error);
    }
  }
);
export const deleteAddress: any = createAsyncThunk(
  "address/deleteAddress",
  async (addressId: number) => {
    try {
      const response = await axiosInstance.delete(
        `/addresses/delete/${addressId}`
      );
      return response.data.result;
    } catch (error) {
      console.log("Delete address fail:", error);
    }
  }
);
export const updateDefaultAddress: any = createAsyncThunk(
  "address/setDefaultAddress",
  async (addressId: number) => {
    try {
      const response = await axiosInstance.put(
        `/addresses/set-default/${addressId}`
      );
      return response.data.result;
    } catch (error) {
      console.log("Set default address fail:", error);
    }
  }
);
export const fetchDefaultAddress: any = createAsyncThunk(
  "address/fetchDefaultAddress",
  async () => {
    try {
      const response = await axiosInstance.get(`/addresses/default`);
      return response.data.result;
    } catch (error) {
      console.log("Get default address fail:", error);
    }
  }
);

const initialState: any = {
  addresses: [],
  address: {},
  defaultAddress: {},
  loading: "idle",
};

const addressSlice = createSlice({
  name: "addresses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddressByUser.fulfilled, (state, action) => {
        state.addresses = action.payload;
        state.loading = "pending";
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
        state.loading = "succeeded";
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(
          (address: any) => address.id !== action.payload.id
        );
        state.loading = "failed";
      })
      .addCase(updateDefaultAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.map((address: any) =>
          address.id === action.payload.id
            ? { ...address, defaultAddress: true }
            : { ...address, defaultAddress: false }
        );
        state.defaultAddress = action.payload;
        state.loading = "failed";
      })
      .addCase(fetchDefaultAddress.fulfilled, (state, action) => {
        state.defaultAddress = action.payload;
        state.loading = "succeeded";
      });
  },
});
export default addressSlice.reducer;
