import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile, AuthState } from '@/types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    }
  }
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
