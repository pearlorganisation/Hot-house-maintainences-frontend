const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  order: null,
  isSuccess: null,
  customizationData: null,
  TOTAL_DEFAUTL_TOPPINGS: 0,
  MAX_TOPPINGS: 8,
  miles: 0,
  defaultTimeSelected: true,
};

const orderDetailsSlice = createSlice({
  name: "orderDetails",
  initialState: initialState,
  reducers: {
    addOrderDetails: (state, action) => {
      state.order = action.payload;
    },
    addOrderTime: (state, action) => {
      const data = {...state.order}
      state.order = { 
        time: action.payload.time, 
        orderType: action.payload.orderType,
        ...(data?.address ? {address: data?.address} : {})
      }
    },
    updateOrderTime: (state, action) => {
      const data = {...state.order}
      data.time = action ? action : data?.time
      state.order = data
    },
    addOrderAddress: (state, action) => {
      const data = {...state.order}
      if(!data.orderType) data.orderType = action?.payload?.orderType ?? "delivery"
      data.address = action.payload.address
      state.order = data
    },
    clearOrderDetails: (state) => {
      state.order = null;
      state.miles = 0
    },
    updateDefaultTimeSelected: (state, action) => {
      state.defaultTimeSelected = action.payload
    },
    successRedirectStatus: (state, action) => {
      state.isSuccess = action.payload
    },
    trackerStatus: (state, action) => {
      state.trackerStatus = action.payload
    },
    getCustomizationDetails: (state, action) => {

      const {
        sauceName,
        cheeseName,
        vegetarianToppingsName,
        meatToppingsName,
      } = action.payload;
      const flatArray = [
        sauceName,
        cheeseName,
        vegetarianToppingsName,
        meatToppingsName,
      ].flat();
      const MAX_TOPPINGS_BACKEND = flatArray.length;
      if (MAX_TOPPINGS_BACKEND > state.MAX_TOPPINGS) {

        state.MAX_TOPPINGS = flatArray.length;
      }
      state.customizationData = action.payload;
    },
    saveMiles: (state, action) => {
      state.miles = action.payload
    }
  },
});

export const { addOrderDetails, addOrderAddress, addOrderTime,updateOrderTime, clearOrderDetails,updateDefaultTimeSelected, getCustomizationDetails, successRedirectStatus, trackerStatus, saveMiles } =
  orderDetailsSlice.actions;
export default orderDetailsSlice.reducer;
