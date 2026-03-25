import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    id: '',
    email: '',
    name: '',
    status: '',
    role: '',
  },
  accessToken: '',
  refreshToken: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload.accessToken;
    },
    setRefreshToken(state, action) {
      state.refreshToken = action.payload.refreshToken;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = initialState.user;
      state.accessToken = initialState.accessToken;
      state.refreshToken = initialState.refreshToken;
    },
  },
});

export const { login, setAccessToken, setRefreshToken, logout, completeRegistration } =
  authSlice.actions;
export default authSlice.reducer;
