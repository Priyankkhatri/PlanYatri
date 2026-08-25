import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Trip } from '@/types';
import { MOCK_TRIPS } from '@/data/mockData';

export const fetchTrips = createAsyncThunk('trips/fetchTrips', async () => {
  return MOCK_TRIPS;
});

export const createTrip = createAsyncThunk('trips/createTrip', async (tripData: any) => {
  return { id: `trip-${Date.now()}`, ...tripData };
});

export const tripSlice = createSlice({
  name: 'trips',
  initialState: { trips: MOCK_TRIPS, loading: false },
  reducers: {
    addTrip: (state, action: PayloadAction<Trip>) => {
      state.trips.unshift(action.payload);
    },
    deleteTrip: (state, action: PayloadAction<string | number>) => {
      state.trips = state.trips.filter(t => t.id !== action.payload);
    },
    updateTrip: (state, action: PayloadAction<Partial<Trip> & { id: string | number }>) => {
      const idx = state.trips.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) {
        state.trips[idx] = { ...state.trips[idx], ...action.payload };
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createTrip.fulfilled, (state, action: any) => {
      state.trips.unshift(action.payload);
    });
  }
});

export const { addTrip, deleteTrip, updateTrip } = tripSlice.actions;
export default tripSlice.reducer;
