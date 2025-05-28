// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "./projectsSlice";
import UiReducer from "./UiSlice"; // Corrected import path for UiSlice
// Import other reducers...

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    ui: UiReducer,
    // Add other reducers here...
  },
});

// Define RootState and AppDispatch types
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
