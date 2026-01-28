
// src/features/slices/siteSettingsSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { getSiteSettings } from "./siteSettingsActions";

const initialState = {
  isLoading: false,
  isSuccess: false,
  siteSettingsData: [],
  isDeleted: false,
  errorMessage: "",
};

export const siteSettingsSlice = createSlice({
  name: "siteSettings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle Get Site Settings
      .addCase(getSiteSettings.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.errorMessage = "";
      })
      .addCase(getSiteSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.errorMessage = "";
        // ✅ backend returns { status, message, data: [...] }
        state.siteSettingsData = action.payload.data || [];
      })
      .addCase(getSiteSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.errorMessage = action.payload || "Failed to fetch site settings.";
      })

     
  },
});

export default siteSettingsSlice.reducer;
