import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// const API_BASE_URL = "http://localhost:5000/api";
// const API_BASE_URL = "http://127.0.0.1:5000/api";
// env.VITE_API_BASE_URL = http://127.0.0.1:5000/api or https://<your-aws-domain>/api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const savedUser = JSON.parse(localStorage.getItem("user"));
const initialState = {
  user: savedUser || null,
  balance: savedUser?.balance || 0,
  status: "idle",
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/login`,
        { email, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  }
);
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        //"http://localhost:5000/api/logout",
        `${API_BASE_URL}/logout`,
        {},
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data || "Logout failed");
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        const { data } = action.payload || {};
        const { username, balance } = data || {};

        state.user = username ? { username } : null;
        state.balance = balance || 0;
        state.status = "Successful";

        localStorage.setItem("user", JSON.stringify({ username, balance }));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "Failed";
        state.error = action.payload;
      })

      // logout
      .addCase(logout.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.balance = 0;
        state.status = "idle";
        localStorage.removeItem("user");
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "Failed";
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
