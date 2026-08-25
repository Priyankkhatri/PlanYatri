import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EmergencyContact } from '@/types';
import { MOCK_EMERGENCY_CONTACTS } from '@/data/mockData';

export const emergencySlice = createSlice({
  name: 'emergency',
  initialState: { contacts: MOCK_EMERGENCY_CONTACTS },
  reducers: {
    addContact: (state, action: PayloadAction<EmergencyContact>) => {
      state.contacts.push(action.payload);
    }
  }
});

export const { addContact } = emergencySlice.actions;
export default emergencySlice.reducer;
