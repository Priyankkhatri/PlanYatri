import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { EmergencyContact } from '@/types';
import { MOCK_EMERGENCY_CONTACTS } from '@/data/mockData';

export const fetchContacts = createAsyncThunk('emergency/fetchContacts', async () => {
  return MOCK_EMERGENCY_CONTACTS;
});

export const emergencySlice = createSlice({
  name: 'emergency',
  initialState: { contacts: MOCK_EMERGENCY_CONTACTS, loading: false },
  reducers: {
    addContact: (state, action: PayloadAction<EmergencyContact>) => {
      state.contacts.push(action.payload);
    },
    removeContact: (state, action: PayloadAction<string>) => {
      state.contacts = state.contacts.filter(c => c.id !== action.payload);
    }
  }
});

export const { addContact, removeContact } = emergencySlice.actions;
export default emergencySlice.reducer;
