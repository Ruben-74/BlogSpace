import { configureStore } from "@reduxjs/toolkit";

import menuReducer from "./slicesRedux/menu";
import userReducer from "./slicesRedux/user";

const store = configureStore({
  reducer: {
    menu: menuReducer,
    user: userReducer,
  },
});

export default store;
