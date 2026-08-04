import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",

  initialState: {
    token: null,
  },

  reducers: {
    setAuthToken: (state, action) => {
      state.token = action.payload;
    },

    clearAuthToken: (state) => {
      state.token = null;
    },
  },
});

export const { setAuthToken, clearAuthToken } = authSlice.actions;

export default authSlice.reducer;