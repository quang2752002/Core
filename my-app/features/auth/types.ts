export interface AuthUser {
  userName: string;
  roles: string[];
  permissions: string[];
}

export interface LoginDto {
  userName: string;
  password: string;
}
