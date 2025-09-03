import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice'; // Assuming your apiSlice is here

export const store = configureStore({
  reducer: {
    // Add your RTK Query apiSlice reducer
    [apiSlice.reducerPath]: apiSlice.reducer,
    // Add other reducers here if you have them
  },
  // Adding the api middleware enables caching, invalidation, polling, and other features of RTK Query
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;