const { createSlice } = require("@reduxjs/toolkit");

const pathSlice = createSlice({
  name: "path",
  initialState: {
    previousPath: "",
  },

  reducers: {
    getPreviousPath: (state, action) => {
      state.previousPath = action.payload;
    },
  },
});

export const { getPreviousPath } = pathSlice.actions;
export default pathSlice.reducer;
