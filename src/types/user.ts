export interface UserPreferences {
  currency: string;
  language: string;
  theme: 'dark' | 'light' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}
