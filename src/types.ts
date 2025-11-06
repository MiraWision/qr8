import { BaseState } from '@lib/wings';

// Example: User State
export type User = {
  id: string;
  name: string;
  email: string;
};

export type UserState = BaseState & {
  currentUser: User | null;
  isAuthenticated: boolean;
};

// Example: Data State
export type DataItem = {
  id: string;
  title: string;
  description: string;
};

export type DataState = BaseState & {
  items: DataItem[];
  loading: boolean;
};