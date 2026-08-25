import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EmergencyContact, SOSAlert } from '@/types';
import { MOCK_EMERGENCY_CONTACTS } from '@/data/mockData';

interface EmergencyState {
  contacts: EmergencyContact[];
  activeAlert: SOSAlert | null;
}

const initialState: EmergencyState = {
  contacts: MOCK_EMERGENCY_CONTACTS,
  activeAlert: null
};

export const emergencySlice = createSlice({
  name: 'emergency',
  initialState,
  reducers: {
    addContact: (state, action: PayloadAction<EmergencyContact>) => {
      state.contacts.push(action.payload);
    },
    triggerSOS: (state, action: PayloadAction<SOSAlert>) => {
      state.activeAlert = action.payload;
    },
    clearSOS: (state) => {
      state.activeAlert = null;
    }
  }
});

export const { addContact, triggerSOS, clearSOS } = emergencySlice.actions;
export default emergencySlice.reducer;
