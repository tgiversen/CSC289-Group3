import { createSlice } from "@reduxjs/toolkit";

const initialState = { balance: 0, lastResult: null, loading: false };

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {},
});
