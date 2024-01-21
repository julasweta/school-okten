import { configureStore } from "@reduxjs/toolkit";
import { authReducer, ordersReducer, usersReducer } from "./slices";

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    auth: authReducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// типізація всіх states
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
