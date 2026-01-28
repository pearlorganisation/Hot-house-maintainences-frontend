const { createSlice } = require("@reduxjs/toolkit");
const initialState = {
  selectedReceipt: null,
};
const receiptslice = createSlice({
  name: "receipt",
  initialState,
  reducers: {
    getSelectedReceipt: (state, action) => {
      state.selectedReceipt = action?.payload;
    },
  },
});

export const { getSelectedReceipt } = receiptslice.actions;
export default receiptslice.reducer;
