import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../stores/authSlice";
import gameReducer from "../stores/gameSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    game: gameReducer,
  },
});
