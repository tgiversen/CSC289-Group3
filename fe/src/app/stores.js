import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../stores/authSlice";
import regReducer from "../../stores/regSlice"
import gameReducer from "../stores/gameSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    reg: regReducer,
    game: gameReducer,
  },
});
