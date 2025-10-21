// import { createSlice } from "@reduxjs/toolkit";

// const initialState = { user: null, status: "idle" };

// export const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {},
// });
// export default authSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";
const initialState = { user: null, status: "idle", error: null };

// ✅ 导出 login（你的 Login.jsx 正是 import 它）
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "Successful";
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "Failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
