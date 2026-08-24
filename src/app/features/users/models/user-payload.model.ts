import { UserRole } from './user.model';

export interface UserPayload {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
}
