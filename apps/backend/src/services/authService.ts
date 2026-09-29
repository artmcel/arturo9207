import { v4 as uuidv4 } from 'uuid';
import { userModel } from '../models/user';
import { hashPassword, verifyPassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { RegisterRequest, LoginRequest, AuthResponse, UserPublic } from '@sisu/shared';

export class AuthService {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const existingUser = await userModel.findByEmail(data.email);
    if (existingUser) {
      throw new Error('El correo electrónico ya está registrado');
    }

    const passwordHash = await hashPassword(data.password);
    const now = new Date();

    const user = {
      id: uuidv4(),
      fullName: data.fullName,
      email: data.email.toLowerCase(),
      passwordHash,
      balance: 0,
      createdAt: now,
    };

    await userModel.create(user);
    const publicUser = userModel.toPublic(user);
    const token = generateToken({ sub: user.id, email: user.email });

    return { user: publicUser, token };
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const user = await userModel.findByEmail(data.email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isValid = await verifyPassword(data.password, user.passwordHash);
    if (!isValid) {
      throw new Error('Credenciales inválidas');
    }

    const publicUser = userModel.toPublic(user);
    const token = generateToken({ sub: user.id, email: user.email });

    return { user: publicUser, token };
  }

  async getUserById(userId: string): Promise<UserPublic | null> {
    const user = await userModel.findById(userId);
    return user ? userModel.toPublic(user) : null;
  }

  async updateBalance(userId: string, newBalance: number): Promise<UserPublic | null> {
    const user = await userModel.updateBalance(userId, newBalance);
    return user ? userModel.toPublic(user) : null;
  }
}

export const authService = new AuthService();