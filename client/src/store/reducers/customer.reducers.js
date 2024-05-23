import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getCustomerAccessTokenFromLS,
  removeCustomerAccessTokenFromLS,
  setCustomerAccessTokenToLS,
} from "../../utils/localStorage";
import { jwtDecode } from "jwt-decode";
import api from "../../api/api";

// 1. Customer đăng ký tài khoản
export const customer_register = createAsyncThunk(
  "customer/customer_register",
  async (body, thunkAPI) => {
    try {
      const response = await api.post("/customer-register", body, {
        signal: thunkAPI.signal,
        withCredentials: true,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// 2. Reducer customer xác thực email
export const verify_email_customer = createAsyncThunk(
  "auth/verify_email_customer",
  async (email_token, thunkAPI) => {
    try {
      const response = await api.post(`/verify-email-customer/${email_token}`, {
        signal: thunkAPI.signal,
        withCredentials: true,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// 3. Reducer customer đăng nhập
export const customer_login = createAsyncThunk(
  "customer/customer_login",
  async (body, thunkAPI) => {
    try {
      const response = await api.post("/customer-login", body, {
        signal: thunkAPI.signal,
        withCredentials: true,
      });
      setCustomerAccessTokenToLS(response.data.data);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// 4. Giải mã token
export const decode_customer_access_token = (customer_access_token) => {
  if (customer_access_token) {
    const decode = jwtDecode(customer_access_token);
    const expireTime = new Date(decode.exp * 1000);
    if (new Date() > expireTime) {
      removeCustomerAccessTokenFromLS();
    } else {
      return decode;
    }
  }
  return null;
};

// 5. Reducer customer đăng xuất
export const customer_logout = createAsyncThunk(
  "customer/customer_logout",
  async (_, thunkAPI) => {
    try {
      await api.get("/customer-logout", {
        signal: thunkAPI.signal,
        withCredentials: true,
      });
      removeCustomerAccessTokenFromLS();
      return thunkAPI.fulfillWithValue();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const customerSlice = createSlice({
  name: "customer",
  initialState: {
    loading: false,
    userInfo: decode_customer_access_token(getCustomerAccessTokenFromLS()),
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
      .addCase(customer_register.fulfilled, (state, action) => {
        state.loading = false;
        state.success_message = action.payload.message;
      })
      .addCase(verify_email_customer.fulfilled, (state, action) => {
        state.loading = false;
        state.success_message = action.payload.message;
      })
      .addCase(customer_login.fulfilled, (state, action) => {
        state.loading = false;
        state.success_message = action.payload.message;
        state.userInfo = decode_customer_access_token(action.payload.data);
      })
      .addCase(customer_logout.fulfilled, (state, action) => {
        state.userInfo = null;
        state.success_message = action.payload.message;
      })
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state, action) => {
          if (
            state.loading &&
            state.currentRequestId === action.meta.requestId
          ) {
            state.loading = false;
            state.currentRequestId = undefined;
          }
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          if (
            state.loading &&
            state.currentRequestId === action.meta.requestId
          ) {
            state.error_message = action.payload.message;
            state.loading = false;
            state.currentRequestId = undefined;
          }
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state, action) => {
          if (state.loading === false) {
            state.loading = true;
            state.currentRequestId = action.meta.requestId;
          }
        }
      );
  },
});

export const { message_clear } = customerSlice.actions;
const customerReducer = customerSlice.reducer;
export default customerReducer;
