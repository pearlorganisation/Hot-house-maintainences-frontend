import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedStore: "",
};

const selectedStoreSlice = createSlice({
  name: "selectedStore",
  initialState,
  reducers: {
    getSelectedStore: (state, action) => {
      state.selectedStore = action.payload;
    },
  },
});

export const { getSelectedStore } = selectedStoreSlice.actions;

export default selectedStoreSlice.reducer;
