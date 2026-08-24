export type UserRole = 'admin' | 'moderator' | 'user';

export interface AppUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  image?: string;
  role: UserRole;
}
