import { AppUser } from './user.model';

export interface UsersResponse {
  users: AppUser[];
  total: number;
  skip: number;
  limit: number;
}
