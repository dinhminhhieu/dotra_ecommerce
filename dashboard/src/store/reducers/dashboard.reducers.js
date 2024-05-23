import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const get_admin_dashboard_data = createAsyncThunk(
  "dashboard/get_admin_dashboard_data",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/dashboard/get-admin-dashboard-data", {
        signal: thunkAPI.signal,
        withCredentials: true,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const get_seller_dashboard_data = createAsyncThunk(
  "dashboard/get_seller_dashboard_data",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/dashboard/get-seller-dashboard-data", {
        signal: thunkAPI.signal,
        withCredentials: true,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Lấy dữ liệu theo tháng
export const get_data_on_chart = createAsyncThunk(
  "dashboard/get_data_on_chart",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/dashboard/get-data-on-chart", {
        signal: thunkAPI.signal,
        withCredentials: true,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Lấy dữ liệu thống kê trả về cho seller
export const get_seller_chart_data = createAsyncThunk(
  "dashboard/get_seller_chart_data",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/dashboard/get-seller-chart-data", {
        signal: thunkAPI.signal,
        withCredentials: true,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    total_amount: 0,
    total_order: 0,
    total_product: 0,
    total_seller: 0,
    recent_order: [],
    monthlyOrderCounts: [],
    monthlyProductCounts: [],
    monthlySellerCounts: [],
    monthlyCategoryCounts: [],
    monthlyRevenues: [],
    percentagesArray: [],
    currentRequestId: undefined,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(get_admin_dashboard_data.fulfilled, (state, action) => {
        state.total_amount = action.payload.data.totalAmount;
        state.total_order = action.payload.data.totalOrder;
        state.total_product = action.payload.data.totalProduct;
        state.total_seller = action.payload.data.totalSeller;
        state.recent_order = action.payload.data.recentOrder;
      })
      .addCase(get_seller_dashboard_data.fulfilled, (state, action) => {
        state.total_amount = action.payload.data.totalAmount;
        state.total_order = action.payload.data.totalOrder;
        state.total_product = action.payload.data.totalProduct;
        state.recent_order = action.payload.data.recentOrder;
      })
      .addCase(get_data_on_chart.fulfilled, (state, action) => {
        state.monthlyOrderCounts = action.payload.monthlyOrderCounts;
        state.monthlyProductCounts = action.payload.monthlyProductCounts;
        state.monthlySellerCounts = action.payload.monthlySellerCounts;
        state.monthlyCategoryCounts = action.payload.monthlyCategoryCounts;
        state.monthlyRevenues = action.payload.monthlyRevenues;
        state.percentagesArray = action.payload.percentagesArray;
      })
      .addCase(get_seller_chart_data.fulfilled, (state, action) => {
        state.monthlyOrderCounts = action.payload.monthlyOrderCounts;
        state.monthlyProductCounts = action.payload.monthlyProductCounts;
        state.monthlyRevenues = action.payload.monthlyRevenues;
        state.percentagesArray = action.payload.percentagesArray;
      })
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state, action) => {
          if (state.currentRequestId === action.meta.requestId) {
            state.loading = false;
            state.currentRequestId = undefined;
          }
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          if (state.currentRequestId === action.meta.requestId) {
            state.error_message = action.payload.message;
            state.loading = false;
            state.currentRequestId = undefined;
          }
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state, action) => {
          state.loading = true;
          state.currentRequestId = action.meta.requestId;
        }
      );
  },
});

const dashboardReducer = dashboardSlice.reducer;
export default dashboardReducer;
