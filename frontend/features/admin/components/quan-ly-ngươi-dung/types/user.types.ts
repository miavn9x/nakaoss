export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  avatar?: string;
  roles: string[];
  isEmailVerified: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  registrationIp?: string;
  pendingRole?: string | null;
  roleChangeExpires?: string | null;
}

export interface UserListItem extends User {}

export interface ApiResponse<T> {
  message: string;
  data: T;
  errorCode: string | null;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
}

export interface ListApiResponse<T> extends ApiResponse<{
  items: T[];
  pagination: Pagination;
}> {}
