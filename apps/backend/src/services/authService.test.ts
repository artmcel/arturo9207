import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService } from '../services/authService';
import { userModel } from '../models/user';
import { hashPassword, verifyPassword } from '../utils/password';

vi.mock('../models/user');
vi.mock('../utils/password');

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const mockUser = {
        id: 'test-id',
        fullName: 'Test User',
        email: 'test@example.com',
        passwordHash: 'hashed',
        balance: 0,
        createdAt: new Date(),
      };

      (userModel.findByEmail as any).mockResolvedValue(undefined);
      (hashPassword as any).mockResolvedValue('hashed');
      (userModel.create as any).mockResolvedValue(mockUser);
      (userModel.toPublic as any).mockReturnValue({
        id: 'test-id',
        fullName: 'Test User',
        email: 'test@example.com',
        balance: 0,
        createdAt: new Date(),
      });

      const result = await authService.register({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

      expect(result.user.email).toBe('test@example.com');
      expect(result.token).toBeDefined();
      expect(userModel.create).toHaveBeenCalled();
    });

    it('should throw if email already exists', async () => {
      (userModel.findByEmail as any).mockResolvedValue({ id: 'existing' });

      await expect(authService.register({
        fullName: 'Test',
        email: 'existing@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      })).rejects.toThrow('ya está registrado');
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const mockUser = {
        id: 'test-id',
        fullName: 'Test User',
        email: 'test@example.com',
        passwordHash: 'hashed',
        balance: 0,
        createdAt: new Date(),
      };

      (userModel.findByEmail as any).mockResolvedValue(mockUser);
      (userModel.toPublic as any).mockReturnValue({
        id: 'test-id',
        fullName: 'Test User',
        email: 'test@example.com',
        balance: 0,
        createdAt: new Date(),
      });
      (verifyPassword as any).mockResolvedValue(true);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.user.email).toBe('test@example.com');
      expect(result.token).toBeDefined();
    });

    it('should throw for invalid email', async () => {
      (userModel.findByEmail as any).mockResolvedValue(undefined);

      await expect(authService.login({
        email: 'nonexistent@example.com',
        password: 'password123',
      })).rejects.toThrow('Credenciales inválidas');
    });

    it('should throw for invalid password', async () => {
      const mockUser = { passwordHash: 'hashed' };
      (userModel.findByEmail as any).mockResolvedValue(mockUser);
      (verifyPassword as any).mockResolvedValue(false);

      await expect(authService.login({
        email: 'test@example.com',
        password: 'wrongpassword',
      })).rejects.toThrow('Credenciales inválidas');
    });
  });
});