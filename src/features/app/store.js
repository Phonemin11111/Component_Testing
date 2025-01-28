import { configureStore } from "@reduxjs/toolkit";
import { tableUserApi } from "../api/tableUserApi";
import { mealDbApi } from "../api/mealDbApi";
import { fakeStoreApi } from "../api/fakeStoreApi";

export const store = configureStore({
  reducer: {
    [tableUserApi.reducerPath]: tableUserApi.reducer,
    [mealDbApi.reducerPath]: mealDbApi.reducer,
    [fakeStoreApi.reducerPath]: fakeStoreApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(
      tableUserApi.middleware,
      mealDbApi.middleware,
      fakeStoreApi.middleware
    ),
});
