import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
const initialState = { user: null, status: "idle", error: null };

export const login = createAsyncThunk('auth/login', async({ email , password }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
})

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLogOut: (state) => {
      state.user = null;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.msg;
      state.status = false;
    },
    loginFail: (state, action) => {
      state.status = false;
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "Successful";
        state.user = action.payload.msg;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "Failed";
        state.error = action.payload.error;
      })
    }
});


export const { userLogOut, loginSuccess, loginFail } = authSlice.actions;
export default authSlice.reducer;
