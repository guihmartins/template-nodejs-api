import { UserAttributes } from '@models/user.model';
import { CreateUserDto, UserDto, UpdateUserDto } from '@dtos/user.dto';
import database from '@config/database';
import logger from '@utils/logger';
import { QueryTypes, Transaction } from 'sequelize';

export class UserRepository {
  async findAll(): Promise<UserDto[]> {
    try {
      const query = `
        SELECT id, name, email, "createdAt", "updatedAt"
        FROM users
        ORDER BY id
      `;
      
      const users = await database.query(query, {
        type: QueryTypes.SELECT
      }) as UserAttributes[];
      
      return users.map(user => this.toDto(user));
    } catch (error) {
      logger.error('Erro ao buscar usuários:', error);
      throw new Error(`Falha ao buscar usuários: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async findById(id: number): Promise<UserDto | null> {
    const query = `
      SELECT id, name, email, "createdAt", "updatedAt"
      FROM users
      WHERE id = :id
    `;
    
    const [user] = await database.query(query, {
      replacements: { id },
      type: QueryTypes.SELECT
    }) as UserAttributes[];

    return user ? this.toDto(user) : null;
  }

  async create(userData: CreateUserDto, transaction?: Transaction): Promise<UserDto> {
    const query = `
      INSERT INTO users (name, email, password, "createdAt", "updatedAt")
      VALUES (:name, :email, :password, NOW(), NOW())
      RETURNING id, name, email, "createdAt", "updatedAt"
    `;

    const [user] = await database.query(query, {
      replacements: { ...userData },
      type: QueryTypes.INSERT,
      transaction
    }) as UserAttributes[];

    return this.toDto(user);
  }

  async update(id: number, userData: UpdateUserDto, transaction?: Transaction): Promise<UserDto | null> {
    const setClauses = Object.keys(userData)
      .map(key => `"${key}" = :${key}`)
      .join(', ');

    const query = `
      UPDATE users 
      SET ${setClauses}, "updatedAt" = NOW()
      WHERE id = :id
      RETURNING id, name, email, "createdAt", "updatedAt"
    `;

    const [user] = await database.query(query, {
      replacements: { ...userData, id },
      type: QueryTypes.UPDATE,
      transaction
    }) as UserAttributes[];

    return user ? this.toDto(user) : null;
  }

  async findByEmail(email: string): Promise<UserDto[]> {
    const query = `
      SELECT id, name, email, "createdAt", "updatedAt"
      FROM users
      WHERE email = :email
    `;

    const users = await database.query(query, {
      replacements: { email },
      type: QueryTypes.SELECT
    }) as UserAttributes[];

    return users.map(user => this.toDto(user));
  }

  async delete(id: number, transaction?: Transaction): Promise<boolean> {
    const query = `
      DELETE FROM users
      WHERE id = :id
    `;

    const [affectedRows] = await database.query(query, {
      replacements: { id },
      type: QueryTypes.DELETE,
      transaction
    });

    return affectedRows > 0;
  }

  private toDto(user: UserAttributes): UserDto {
    const { password, ...rest } = user;
    return {
      ...rest,
      createdAt: rest.createdAt || new Date(),
      updatedAt: rest.updatedAt || new Date()
    };
  }

  async findByFilters(filters: Partial<UserDto>): Promise<UserDto[]> {
    const whereClauses = Object.entries(filters)
      .map(([key, value]) => `"${key}" = :${key}`)
      .join(' AND ');

    const query = `
      SELECT id, name, email, "createdAt", "updatedAt"
      FROM users
      ${whereClauses ? `WHERE ${whereClauses}` : ''}
    `;

    const users = await database.query(query, {
      replacements: filters,
      type: QueryTypes.SELECT
    }) as UserAttributes[];

    return users.map(user => this.toDto(user));
  }
}