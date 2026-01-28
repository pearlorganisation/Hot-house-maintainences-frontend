import { combineReducers, configureStore } from "@reduxjs/toolkit";
import selectedStoreReducer from "./features/selectedStore/selectedStoreSlice";
import cartReducer from "./features/cartSlice/cartSlice.js";
import authReducer from "./features/auth/authSlice.js";
import orderReducer from "./features/orderDetails/orderDetailsslice.js";
import receiptReducer from "./features/orderDetails/selectedRecipt.js";
import { persistStore, persistReducer } from "redux-persist";
import pathReducer from "./features/path/pathslice.js";
import storage from "redux-persist/lib/storage";
import popup from "./features/popup/popupslice.js"
import siteSettings from "./features/siteSettings/siteSettings.js"

const persistConfig = {
  key: "persist",
  storage,
  blacklist:['popup','siteSettings' ,'cart.createYourOwnPizzaMAX_TOPPINGS']
};

const makeConfiguredStore = () =>
  configureStore({
    reducer: rootReducer,
  });

const rootReducer = combineReducers({
  selectedStore: selectedStoreReducer,
  cart: cartReducer,
  auth: authReducer,
  orderDetails: orderReducer,
  path: pathReducer,
  popup,
  receipt: receiptReducer,
  siteSettings: siteSettings,
});

export const makeStore = () => {
  const isServer = typeof window === "undefined";
  if (isServer) {
    return makeConfiguredStore();
  } else {
    const persistedReducer = persistReducer(persistConfig, rootReducer);
    let store = configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
    });
    store.__persistor = persistStore(store);
    return store;
  }
};
