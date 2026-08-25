export interface ActivityItem {
  id: string;
  time: string;
  title: string;
  location: string;
  cost?: number;
  completed?: boolean;
}

export interface TripDay {
  dayNumber: number;
  date: string;
  activities: ActivityItem[];
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  budget: number;
  spent: number;
  image: string;
  travelers: number;
  days?: TripDay[];
}
