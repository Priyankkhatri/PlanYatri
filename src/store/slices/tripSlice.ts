import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Trip } from '@/types';
import { MOCK_TRIPS } from '@/data/mockData';

interface TripState {
  trips: Trip[];
  activeTrip: Trip | null;
  loading: boolean;
}

const initialState: TripState = {
  trips: MOCK_TRIPS,
  activeTrip: MOCK_TRIPS[0] || null,
  loading: false
};

export const tripSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    setTrips: (state, action: PayloadAction<Trip[]>) => {
      state.trips = action.payload;
    },
    addTrip: (state, action: PayloadAction<Trip>) => {
      state.trips.unshift(action.payload);
    },
    setActiveTrip: (state, action: PayloadAction<Trip | null>) => {
      state.activeTrip = action.payload;
    }
  }
});

export const { setTrips, addTrip, setActiveTrip } = tripSlice.actions;
export default tripSlice.reducer;
