const { createSlice } = require("@reduxjs/toolkit");

const popupSlice = createSlice({
  name: "popup",
  initialState: {
    popupState:null,
  },

  reducers: {
    changePopup: (state, action) => {
      state.popupState = action.payload; //it may contain null , collection , delivery 
    },
  },
});

export const { changePopup } = popupSlice.actions;
export default popupSlice.reducer;
