import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserModel } from '../user';
import { User } from '@sisu/shared';

describe('UserModel', () => {
  let userModel: UserModel;

  beforeEach(() => {
    userModel = new UserModel();
  });

  const createTestUser = (overrides: Partial<User> = {}): User => ({
    id: 'test-id-123',
    fullName: 'Test User',
    email: 'test@example.com',
    passwordHash: 'hashed-password',
    balance: 0,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    ...overrides,
  });

  describe('create', () => {
    it('should store and return the user', async () => {
      const user = createTestUser();
      const result = await userModel.create(user);

      expect(result).toEqual(user);
    });

    it('should allow retrieving user by id after create', async () => {
      const user = createTestUser({ id: 'user-456' });
      await userModel.create(user);

      const found = await userModel.findById('user-456');
      expect(found).toEqual(user);
    });

    it('should allow retrieving user by email after create', async () => {
      const user = createTestUser({ email: 'findme@example.com' });
      await userModel.create(user);

      const found = await userModel.findByEmail('findme@example.com');
      expect(found).toEqual(user);
    });

    it('should find by email case-insensitively', async () => {
      const user = createTestUser({ email: 'Test@Example.COM' });
      await userModel.create(user);

      const found = await userModel.findByEmail('test@example.com');
      expect(found).toEqual(user);
    });
  });

  describe('findById', () => {
    it('should return undefined for non-existent id', async () => {
      const found = await userModel.findById('non-existent');
      expect(found).toBeUndefined();
    });

    it('should return user for existing id', async () => {
      const user = createTestUser({ id: 'existing-id' });
      await userModel.create(user);

      const found = await userModel.findById('existing-id');
      expect(found).toEqual(user);
    });
  });

  describe('findByEmail', () => {
    it('should return undefined for non-existent email', async () => {
      const found = await userModel.findByEmail('notfound@example.com');
      expect(found).toBeUndefined();
    });

    it('should return user for existing email', async () => {
      const user = createTestUser({ email: 'existing@example.com' });
      await userModel.create(user);

      const found = await userModel.findByEmail('existing@example.com');
      expect(found).toEqual(user);
    });

    it('should return undefined when map is empty', async () => {
      const found = await userModel.findByEmail('any@example.com');
      expect(found).toBeUndefined();
    });
  });

  describe('updateBalance', () => {
    it('should update balance for existing user', async () => {
      const user = createTestUser({ id: 'balance-user', balance: 0 });
      await userModel.create(user);

      const updated = await userModel.updateBalance('balance-user', 100);

      expect(updated).toBeDefined();
      expect(updated!.balance).toBe(100);

      const found = await userModel.findById('balance-user');
      expect(found!.balance).toBe(100);
    });

    it('should return undefined for non-existent user', async () => {
      const updated = await userModel.updateBalance('non-existent', 100);
      expect(updated).toBeUndefined();
    });

    it('should handle negative balance', async () => {
      const user = createTestUser({ id: 'neg-balance', balance: 50 });
      await userModel.create(user);

      const updated = await userModel.updateBalance('neg-balance', -10);
      expect(updated!.balance).toBe(-10);
    });

    it('should handle zero balance', async () => {
      const user = createTestUser({ id: 'zero-balance', balance: 100 });
      await userModel.create(user);

      const updated = await userModel.updateBalance('zero-balance', 0);
      expect(updated!.balance).toBe(0);
    });
  });

  describe('toPublic', () => {
    it('should return user without passwordHash', () => {
      const user = createTestUser({ passwordHash: 'secret-hash' });
      const publicUser = userModel.toPublic(user);

      expect(publicUser).toEqual({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        balance: user.balance,
        createdAt: user.createdAt,
      });
      expect('passwordHash' in publicUser).toBe(false);
    });

    it('should preserve all other fields', () => {
      const user = createTestUser({
        id: 'public-123',
        fullName: 'Public User',
        email: 'public@example.com',
        balance: 250,
      });
      const publicUser = userModel.toPublic(user);

      expect(publicUser.id).toBe('public-123');
      expect(publicUser.fullName).toBe('Public User');
      expect(publicUser.email).toBe('public@example.com');
      expect(publicUser.balance).toBe(250);
      expect(publicUser.createdAt).toEqual(user.createdAt);
    });
  });
});