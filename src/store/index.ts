import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/authSlice';
import tripReducer from './slices/tripSlice';
import emergencyReducer from './slices/emergencySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trips: tripReducer,
    emergency: emergencyReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
