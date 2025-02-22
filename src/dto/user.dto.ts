export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
}

export interface UserDto {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}