import { createSlice } from "@reduxjs/toolkit";

const initialState = { user: null, status: "idle" };

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
});
