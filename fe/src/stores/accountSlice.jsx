import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = "http://127.0.0.1:5000/api/";

const initialState = { rewardsHistory: [] };

const rewardsHistoryGet = createAsyncThunk(
  "game/rewardsHistoryGet",
  async (data) => {
    return axios
      .get(`${api}rewards/${encodeURIComponent(data.username)}`, data.config)
      .then((res) => res.data);
  }
);

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(rewardsHistoryGet.fulfilled, (state, action) => {
      state.rewardsHistory = Array.isArray(action.payload)
        ? action.payload
        : [];
    });
  },
});
export default accountSlice.reducer;
export { rewardsHistoryGet };
