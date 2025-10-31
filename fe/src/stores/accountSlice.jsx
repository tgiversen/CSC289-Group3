// fe/src/stores/accountSlice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = "http://127.0.0.1:5000/api/";

const initialState = {
  rewardsHistory: [],
  status: "idle",
  error: null,
};

export const rewardsHistoryGet = createAsyncThunk(
  "account/rewardsHistoryGet",
  async ({ username, config }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${api}rewards/${encodeURIComponent(username)}`,
        config
      );
      return res.data; // { status, msg, data: [...] }
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch history");
    }
  }
);

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(rewardsHistoryGet.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(rewardsHistoryGet.fulfilled, (state, action) => {
        state.status = "succeeded";
        const list = action.payload?.data;
        state.rewardsHistory = Array.isArray(list) ? list : [];
      })
      .addCase(rewardsHistoryGet.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Error";
        state.rewardsHistory = [];
      });
  },
});

export default accountSlice.reducer;
