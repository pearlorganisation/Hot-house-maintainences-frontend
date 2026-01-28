import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
  isUserLoggedIn: false,
  isGuestLoggedIn: false,
  newPassword:"",
  forgetPasswordEmail:"",
};
// Function to load user data from localStorage
const loadUserData = () => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedData = JSON.parse(userData);
      return {
        userData: parsedData.userData,
        isUserLoggedIn: parsedData.isUserLoggedIn,
      };
    }
  }
  return initialState;
};

const authslice = createSlice({
  name: "auth",
  initialState: loadUserData(),
  reducers: {
    getcredentials: (state, action) => {
      return (state = action.payload);
    },
    addNewPassword: (state, action) => {
      state.newPassword = action.payload;
    },
    setForgetPasswordEmail:(state,action) =>{
      state.forgetPasswordEmail = action.payload;
    },

    addUserData: (state, action) => {
      const data = action.payload;
      console.log(data);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userData: data?.data,
          isUserLoggedIn: data?.isUserLoggedIn,
        })
      );
      state.userData = data?.data;
      state.isUserLoggedIn = data?.isUserLoggedIn;
    },
    userLogout: (state, action) => {
      localStorage.removeItem("userData");
      state.isGuestLoggedIn= false;

      state.isUserLoggedIn = false;
      state.userData = null;
    },
    guestLogin: (state, action) => {
      state.isGuestLoggedIn = true;

      state.userData = null;
    },
    oAuthLogin:(state,action)=>{
      state.isUserLoggedIn = true,
      state.userData= action.payload

    }
  },
});
export const { getcredentials,addNewPassword, addUserData, userLogout , setForgetPasswordEmail,guestLogin,oAuthLogin } = authslice.actions;
export default authslice.reducer;
