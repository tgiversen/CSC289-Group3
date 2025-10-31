import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = "http://127.0.0.1:5000/api/";

const initialState = {
  balance: 0,
  lastResult: [],
  rewards: {
    free_spin: false,
    jackpot: false,
    message: "",
    points: 0,
  },
  status: "idle",
  error: null,
};

//Spin: POST /api/spin  body: { username, bet }
const spinPost = createAsyncThunk("game/spinPost", async (data) => {
  return axios.post(`${api}spin`, data.body, data.config).then((res) => {
    return res.data;
  });
});

//Free Spins: POST /api/free-spins  body: { username }
const freeSpinsPost = createAsyncThunk("game/freeSpinsPost", async (data) => {
  return axios.post(`${api}free-spins`, data.body, data.config).then((res) => {
    return res.data;
  });
});

//Balance: GET /api/balance/:username
const balanceGet = createAsyncThunk("game/balanceGet", async (data) => {
  return axios
    .get(`${api}balance/${encodeURIComponent(data.username)}`, data.config)
    .then((res) => res.data);
});

//Daily Login: POST /api/daily-reward  body: { username }
const dailyRewardPost = createAsyncThunk(
  "game/dailyRewardPost",
  async (data) => {
    return axios
      .post(`${api}daily-reward`, data.body, data.config)
      .then((res) => {
        return res.data;
      });
  }
);

//Buy Coins: POST /api/buy-coins  body: { username, amount }
const buyCoinsPost = createAsyncThunk("game/buyCoinsPost", async (data) => {
  return axios.post(`${api}buy-coins`, data.body, data.config).then((res) => {
    return res.data;
  });
});

//Reward Types: GET /api/rewards
const rewardTypesGet = createAsyncThunk("game/rewardTypesGet", async (data) => {
  return axios.get(`${api}rewards`, data?.config).then((res) => res.data); // []
});

/* ---------------- Slice ---------------- */
export const gameSlice = createSlice({
  name: "gameSlice",
  initialState,
  reducers: {
    clearLastSpin(state) {
      state.lastSpin = null;
    },
  },
  extraReducers: (builder) => {
    // Spin
    builder
      .addCase(spinPost.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { status, msg, data } = action.payload || {};
        const { new_balance, result, rewards } = data || {};

        if (typeof new_balance === "number") state.balance = new_balance;
        if (Array.isArray(result)) state.lastResult = result;
        if (rewards)
          state.rewards = {
            free_spin: !!rewards.free_spin,
            jackpot: !!rewards.jackpot,
            message: rewards.message || msg || "",
            points: Number(rewards.points || 0),
          };

        if (state.rewards.jackpot && !state.rewards.message) {
          state.rewards.message = "🎉 JACKPOT!";
        }
      })
      .addCase(spinPost.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          typeof action.payload === "string" ? action.payload : "Spin failed";
      });

    // Free Spin
    builder.addCase(freeSpinsPost.fulfilled, (state, action) => {
      const { result, win, winAmount, balance, freeSpins } =
        action.payload || {};
      state.lastSpin = { result, win, winAmount };
      if (typeof balance === "number") state.balance = balance;
      if (typeof freeSpins === "number") state.freeSpins = freeSpins;
    });

    // Balance
    builder.addCase(balanceGet.fulfilled, (state, action) => {
      const { balance, level, freeSpins } = action.payload || {};
      if (typeof balance === "number") state.balance = balance;
      if (typeof level === "number") state.level = level;
      if (typeof freeSpins === "number") state.freeSpins = freeSpins;
    });

    // Daily reward
    builder.addCase(dailyRewardPost.fulfilled, (state, action) => {
      const { balance } = action.payload || {};
      if (typeof balance === "number") state.balance = balance;
    });

    // Buy coins
    builder.addCase(buyCoinsPost.fulfilled, (state, action) => {
      const { balance } = action.payload || {};
      if (typeof balance === "number") state.balance = balance;
    });

    // Reward types
    builder.addCase(rewardTypesGet.fulfilled, (state, action) => {
      state.rewardTypes = Array.isArray(action.payload) ? action.payload : [];
    });
  },
});

export const { clearLastSpin } = gameSlice.actions;
export default gameSlice.reducer;

export {
  spinPost,
  freeSpinsPost,
  balanceGet,
  dailyRewardPost,
  buyCoinsPost,
  rewardTypesGet,
};
