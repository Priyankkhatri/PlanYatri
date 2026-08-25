export const isValidEmail = (email: string): boolean => {
  return /^[^s@]+@[^s@]+.[^s@]+$/.test(email);
};

export const isMinLength = (str: string, min: number): boolean => {
  return str.trim().length >= min;
};
