import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Trip } from '@/types';
import { MOCK_TRIPS } from '@/data/mockData';

export const tripSlice = createSlice({
  name: 'trips',
  initialState: { trips: MOCK_TRIPS },
  reducers: {
    addTrip: (state, action: PayloadAction<Trip>) => {
      state.trips.unshift(action.payload);
    }
  }
});

export const { addTrip } = tripSlice.actions;
export default tripSlice.reducer;
