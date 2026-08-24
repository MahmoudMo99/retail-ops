export type UserSortOrder = 'asc' | 'desc';

export interface UsersQuery {
  limit: number;
  skip: number;
  search?: string;
  sortBy?: string;
  order?: UserSortOrder;
}
