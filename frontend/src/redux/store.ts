import { configureStore } from "@reduxjs/toolkit";
import { ordersReducer } from "./slices/OrderSlices";
import { authReducer } from "./slices/AuthSlice";
// ...

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// типізація всіх states
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
