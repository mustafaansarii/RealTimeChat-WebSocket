import { createSlice } from '@reduxjs/toolkit';
import config from '../ config'

const initialState = {
  user: null,
  token: localStorage.getItem('token') || '',
  status: 'idle',  // 'idle', 'loading', 'succeeded', 'failed'
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state) => {
      state.status = 'loading';
    },
    loginSuccess: (state, action) => {
      state.status = 'succeeded';
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token); // Save token in localStorage
    },
    loginFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    logout: (state) => {
      state.status = 'idle';
      state.user = null;
      state.token = '';
      localStorage.removeItem('token'); // Remove token from localStorage
    },
    signUpSuccess: (state, action) => {
      state.status = 'succeeded';
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token); // Save token in localStorage
    },
    signUpFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});

export const { login, loginSuccess, loginFailure, logout, signUpSuccess, signUpFailure } = authSlice.actions;

export default authSlice.reducer;

// Async Thunk for SignUp
export const signUpUser = (credentials) => async (dispatch) => {
  try {
    const response = await fetch(`${config.Backend_Api}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (data.status === false) {
      return { payload: data };
    } else {
      dispatch(signUpSuccess({ user: data.user, token: data.jwt }));
      return { payload: data };
    }
  } catch (error) {
    console.error('Signup error:', error);
    return { payload: { status: false, message: 'An error occurred. Please try again.' } };
  }
};

// Async Thunk for Login
export const loginUser = (credentials) => async (dispatch) => {
  try {
    const response = await fetch(`${config.Backend_Api}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (data.status === false) {
      return { payload: data };
    } else {
      dispatch(loginSuccess({ user: data.user, token: data.jwt }));
      return { payload: data };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { payload: { status: false, message: 'An error occurred. Please try again.' } };
  }
};
