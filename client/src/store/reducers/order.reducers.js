import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

// 1. Reducer đặt hàng
export const place_order = createAsyncThunk(
  "order/place_order",
  async (
    {
      customerId,
      customer_name,
      products,
      price,
      shipping_fee,
      items,
      navigate,
      shippingInfo,
    },
    thunkAPI
  ) => {
    try {
      const response = await api.post(
        "/order/place-order",
        {
          customerId,
          customer_name,
          products,
          price,
          shipping_fee,
          items,
          navigate,
          shippingInfo,
        },
        {
          signal: thunkAPI.signal,
          withCredentials: true,
        }
      );
      navigate("/payment", {
        state: {
          orderId: response.data.data,
          price: price + shipping_fee,
          items,
        },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// 2. Reducer lấy thông tin đơn hàng
export const get_orders = createAsyncThunk(
  "order/get_orders",
  async (customerId, thunkAPI) => {
    try {
      const response = await api.get(`/order/get-orders/${customerId}`, {
        signal: thunkAPI.signal,
        withCredentials: true,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// 3. Reducer lấy thông tin chi tiết đơn hàng
export const get_order_details = createAsyncThunk(
  "order/get_order_details",
  async (orderId, thunkAPI) => {
    try {
      const response = await api.get(`/order/get-order-details/${orderId}`, {
        signal: thunkAPI.signal,
        withCredentials: true,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    order_details: {},
    success_message: "",
    error_message: "",
    currentRequestId: undefined,
  },
  reducers: {
    message_clear: (state) => {
      state.success_message = "";
      state.error_message = "";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(get_orders.fulfilled, (state, action) => {
        state.orders = action.payload.data;
      })
      .addCase(get_order_details.fulfilled, (state, action) => {
        state.order_details = action.payload.data;
      })
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state, action) => {
          if (state.currentRequestId === action.meta.requestId) {
            state.currentRequestId = undefined;
          }
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          if (state.currentRequestId === action.meta.requestId) {
            state.currentRequestId = undefined;
            state.error_message = action.payload.message;
          }
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state, action) => {
          state.currentRequestId = action.meta.requestId;
        }
      );
  },
});

export const { message_clear } = orderSlice.actions;
const orderReducer = orderSlice.reducer;
export default orderReducer;
