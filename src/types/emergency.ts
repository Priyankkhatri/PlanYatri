export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isPrimary?: boolean;
}

export interface SOSAlert {
  id: string;
  timestamp: string;
  location: { lat: number; lng: number; address?: string };
  status: 'active' | 'resolved';
}
