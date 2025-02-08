import { configureStore } from '@reduxjs/toolkit';
// src/store/index.js
import authReducer from '../slices/authSlice';  // Update the path to point to slices/authSlice.js


export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
