import { UserRepository } from '@repositories/user.repository';
import { CreateUserDto, UpdateUserDto, UserDto } from '@dtos/user.dto';
import { hashPassword } from '@utils/password.utils';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(userData: CreateUserDto): Promise<UserDto> {
    const hashedPassword = await hashPassword(userData.password);
    const userWithHashedPassword = {
      ...userData,
      password: hashedPassword,
    };
    
    return await this.userRepository.create(userWithHashedPassword);
  }

  async findAll(): Promise<UserDto[]> {
    return await this.userRepository.findAll();
  }

  async findById(id: number): Promise<UserDto | null> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDto[]> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    return user;
  }

  async update(userId: number, userData: UpdateUserDto): Promise<UserDto | null> {
    if (userData.password) {
      userData.password = await hashPassword(userData.password);
    }
    
    return await this.userRepository.update(userId, userData);
  }

  async delete(id: number): Promise<boolean> {
    return await this.userRepository.delete(id);
  }
}
