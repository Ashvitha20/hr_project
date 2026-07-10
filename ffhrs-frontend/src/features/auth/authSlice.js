import { createSlice } from '@reduxjs/toolkit';

const persisted = JSON.parse(localStorage.getItem('ffhrs_auth') || 'null');

const initialState = {
  user: persisted?.user || null, // { id, name, email, role }
  accessToken: persisted?.accessToken || null,
  isAuthenticated: Boolean(persisted?.accessToken),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user = user ?? state.user;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      localStorage.setItem(
        'ffhrs_auth',
        JSON.stringify({ user: state.user, accessToken })
      );
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('ffhrs_auth');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.user?.role;
