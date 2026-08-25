import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile, AuthState } from '@/types';

export const login = createAsyncThunk('auth/login', async (credentials: any) => {
  return {
    id: 'usr-1',
    name: 'Alex Rivera',
    email: credentials?.email || 'alex@planyatri.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    bio: 'Luxury Travel Enthusiast & Explorer'
  };
});

export const register = createAsyncThunk('auth/register', async (userData: any) => {
  return {
    id: `usr-${Date.now()}`,
    name: userData?.name || 'New Traveler',
    email: userData?.email || 'user@planyatri.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    bio: 'New PlanYatri Explorer'
  };
});

export const loginDemo = createAsyncThunk('auth/loginDemo', async () => {
  return {
    id: 'usr-demo',
    name: 'Alex Rivera',
    email: 'alex@planyatri.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    bio: 'Demo Luxury Traveler'
  };
});

const initialState: AuthState = {
  user: {
    id: 'usr-1',
    name: 'Alex Rivera',
    email: 'alex@planyatri.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    bio: 'Luxury Travel Enthusiast & Explorer'
  },
  isAuthenticated: true,
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
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginDemo.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      });
  }
});

export const { setUser, logout, clearError, updateProfile } = authSlice.actions;
export default authSlice.reducer;
