import { vi } from 'vitest';

vi.mock('../src/utils/jwt', () => ({
  generateToken: vi.fn(() => 'mock-token'),
  verifyToken: vi.fn((token) => token === 'valid-token' ? { sub: 'user-123', email: 'test@example.com', iat: Date.now(), exp: Date.now() + 86400000 } : null),
  decodeToken: vi.fn(),
}));

vi.mock('../src/utils/password', () => ({
  hashPassword: vi.fn(() => Promise.resolve('hashed-password')),
  verifyPassword: vi.fn(() => Promise.resolve(true)),
}));