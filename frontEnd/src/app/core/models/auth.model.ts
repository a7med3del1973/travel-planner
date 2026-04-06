export type UserRole = 'ADMIN' | 'USER';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  username: string;
  role: UserRole;
  token: string;
}

export interface AuthUser {
  username: string;
  role: UserRole;
  token: string;
  userId?: number;
}
