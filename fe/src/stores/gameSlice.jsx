import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// const api = "http://127.0.0.1:5000/api/";
// env.VITE_API_BASE_URL = http://127.0.0.1:5000/api or https://<your-aws-domain>/api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const initialState = {
  balance: 0,
  freeSpins: 0,
  rewards: {
    free_spin: false,
    jackpot: false,
    message: "",
    points: 0,
  },
  hasSpun: false,
  status: "idle",
  error: null,
};

const spinPost = createAsyncThunk("game/spinPost", async (data) => {
  // return axios.post(`${api}spin`, data.body, data.config).then((res) => {
  return axios.post(`${API_BASE_URL}/spin`, data.body, data.config).then((res) => {
    return res.data;
  });
});

const freeSpinsPost = createAsyncThunk("game/freeSpinsPost", async (data) => {
  return axios.post(`${API_BASE_URL}/free-spins`, data.body, data.config).then((res) => {
    return res.data;
  });
});

const balanceGet = createAsyncThunk("game/balanceGet", async (data) => {
  return axios
    .get(`${API_BASE_URL}/balance/${encodeURIComponent(data.username)}`, data.config)
    .then((res) => res.data);
});

const dailyRewardPost = createAsyncThunk(
  "game/dailyRewardPost",
  async (data) => {
    return axios
      .post(`${API_BASE_URL}/daily-reward`, data.body, data.config)
      .then((res) => {
        return res.data;
      });
  }
);

const buyCoinsPost = createAsyncThunk("game/buyCoinsPost", async (data) => {
  return axios.post(`${API_BASE_URL}/buy-coins`, data.body, data.config).then((res) => {
    return res.data;
  });
});

const rewardTypesGet = createAsyncThunk("game/rewardTypesGet", async (data) => {
  return axios.get(`${API_BASE_URL}/rewards`, data?.config).then((res) => res.data);
});

export const gameSlice = createSlice({
  name: "gameSlice",
  initialState,
  reducers: {
    setBalance(state, action) {
      const n = Number(action.payload);
      if (!Number.isNaN(n)) state.balance = n;
    },
    clearLastSpin(state) {
      state.lastSpin = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(spinPost.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(spinPost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.hasSpun = true;
        const p = action.payload?.data || {};
        const { new_balance, result, rewards } = p;

        if (typeof new_balance === "number") state.balance = new_balance;
        if (Array.isArray(result)) state.lastResult = result;

        state.rewards = {
          free_spin: !!rewards?.free_spin,
          jackpot: !!rewards?.jackpot,
          message: rewards?.message || action.payload?.msg || "",
          points: Number(rewards?.points || 0),
        };
        if (state.rewards.jackpot && !state.rewards.message) {
          state.rewards.message = "🎉 JACKPOT!";
        }

        const fs = p.remaining_free_spins ?? p.free_spins;
        if (typeof fs === "number") state.freeSpins = fs;
      });

    builder.addCase(freeSpinsPost.fulfilled, (state, action) => {
      const p = action.payload?.data || {};
      const { result, new_balance, remaining_free_spins, rewards } = p;
      state.hasSpun = true;
      if (Array.isArray(result)) state.lastResult = result;

      if (typeof new_balance === "number") {
        state.balance = new_balance;

        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        if (stored && stored.username) {
          localStorage.setItem(
            "user",
            JSON.stringify({ ...stored, balance: new_balance })
          );
        }
      }

      if (typeof remaining_free_spins === "number") {
        state.freeSpins = remaining_free_spins;
      }

      if (rewards) {
        state.rewards = {
          free_spin: !!rewards.free_spin,
          jackpot: !!rewards.jackpot,
          message: rewards.message || action.payload?.msg || "",
          points: Number(rewards.points || 0),
        };
      } else {
        state.rewards = {
          free_spin: false,
          jackpot: false,
          message: "",
          points: 0,
        };
      }

      state.status = "succeeded";
    });

    builder.addCase(balanceGet.fulfilled, (state, action) => {
      const p = action.payload?.data || {};
      const { balance, level } = p;
      const fs = p.free_spins;

      if (typeof balance === "number") state.balance = balance;
      if (typeof level === "number") state.level = level;
      if (typeof fs === "number") state.freeSpins = fs;
    });

    builder.addCase(dailyRewardPost.fulfilled, (state, action) => {
      const p = action.payload?.data || {};
      if (typeof p.balance === "number") state.balance = p.balance;
    });

    builder.addCase(buyCoinsPost.fulfilled, (state, action) => {
      const p = action.payload?.data || {};
      if (typeof p.new_balance === "number") state.balance = p.new_balance;
    });

    builder.addCase(rewardTypesGet.fulfilled, (state, action) => {
      const list = action.payload?.data;
      state.rewardTypes = Array.isArray(list) ? list : [];
    });
  },
});

export const { setBalance, clearLastSpin } = gameSlice.actions;
export default gameSlice.reducer;

export {
  spinPost,
  freeSpinsPost,
  balanceGet,
  dailyRewardPost,
  buyCoinsPost,
  rewardTypesGet,
};
