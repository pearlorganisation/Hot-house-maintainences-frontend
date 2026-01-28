// src/features/actions/siteSettings/siteSettings.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

export const getSiteSettings = createAsyncThunk(
  "siteSettings/getSiteSettings",
  async (_, { rejectWithValue }) => {
    try {
      // console.log('gettings this')
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v2/site-settings`);
      return data; // returns {status, message, data: [...]}
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch site settings.");
    }
  }
);

// export const updateSiteSettings = createAsyncThunk(
//   "siteSettings/updateSiteSettings",
//   async ({ id, payload }, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v2/site-settings/${id}`, payload);
//       return data; // {status, message, data: {...}}
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to update site settings.");
//     }
//   }
// );
