import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../stores/authSlice";
import gameReducer from "../stores/gameSlice";
import regSlice from "../stores/regSlice";
import accountReducer from "../stores/accountSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reg: regSlice,
    game: gameReducer,
    account: accountReducer,
  },
});
