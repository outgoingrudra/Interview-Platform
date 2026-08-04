import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../api/baseApi";
import uiReducer from "../redux/uiSlice";
import authReducer from "../redux/authSlice";

export const store = configureStore({
reducer: {
  [baseApi.reducerPath]: baseApi.reducer,
  ui: uiReducer,
  auth: authReducer,
},

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});