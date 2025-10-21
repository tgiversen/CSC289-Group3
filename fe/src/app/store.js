import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../stores/authSlice";
import gameReducer from "../stores/gameSlice";
import regReducer from "..stores/regSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reg: regReducer,
    game: gameReducer,
  },
});
