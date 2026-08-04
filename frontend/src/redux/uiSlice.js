import { createSlice } from "@reduxjs/toolkit";

const savedTheme = localStorage.getItem("theme") || "forest";

const uiSlice = createSlice({
  name: "ui",

  initialState: {
    theme: savedTheme,
  },

  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
    },
  },
});

export const { setTheme } = uiSlice.actions;

export default uiSlice.reducer;