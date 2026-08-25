export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  budget: number;
  spent: number;
}
