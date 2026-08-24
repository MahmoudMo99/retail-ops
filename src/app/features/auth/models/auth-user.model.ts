export type AuthUserRole = 'admin' | 'moderator' | 'user';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  role: AuthUserRole;
}
