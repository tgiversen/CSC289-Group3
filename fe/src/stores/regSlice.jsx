import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";
const initialState = { user: null, status: "idle", error: null };

export const register = createAsyncThunk(
  "auth/register",
  async ({ email, password, username }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        email,
        password,
        username,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const regSlice = createSlice({
  name: "reg",
  initialState,
  reducers: {
    userLogOut: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "Successful";
        state.user = action.payload.msg;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "Failed";
        state.error = action.payload.error;
      });
  },
});

export const { userLogOut } = regSlice.actions;
export default regSlice.reducer;
