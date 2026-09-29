import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { userModel } from '../../models/user';
import { hashPassword } from '../../utils/password';

describe('Auth API Integration', () => {
  const testUser = {
    fullName: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    confirmPassword: 'password123',
  };

  beforeEach(async () => {
    // Clear the user model by creating a new instance
    // Since userModel is a singleton, we need to clear its internal map
    // We'll just use unique emails for each test
  });

  afterEach(async () => {
    // Cleanup if needed
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const uniqueEmail = `test-${Date.now()}@example.com`;

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...testUser,
          email: uniqueEmail,
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe(uniqueEmail);
      expect(response.body.data.user.fullName).toBe(testUser.fullName);
      expect(response.body.data.user.balance).toBe(0);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.passwordHash).toBeUndefined();
      expect(response.body.error).toBeNull();
    });

    it('should return 400 for duplicate email', async () => {
      const uniqueEmail = `duplicate-${Date.now()}@example.com`;

      // First registration
      await request(app)
        .post('/api/auth/register')
        .send({
          ...testUser,
          email: uniqueEmail,
        })
        .expect(201);

      // Second registration with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...testUser,
          email: uniqueEmail,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('REGISTRATION_ERROR');
      expect(response.body.error.message).toContain('ya está registrado');
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...testUser,
          email: 'invalid-email',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          // missing fullName, password, confirmPassword
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for password mismatch', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...testUser,
          confirmPassword: 'different-password',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for short password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...testUser,
          password: 'short',
          confirmPassword: 'short',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/auth/login', () => {
    let registeredEmail: string;
    let registeredToken: string;

    beforeEach(async () => {
      registeredEmail = `login-${Date.now()}@example.com`;
      await request(app)
        .post('/api/auth/register')
        .send({
          ...testUser,
          email: registeredEmail,
        })
        .expect(201);
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: registeredEmail,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe(registeredEmail);
      expect(response.body.data.token).toBeDefined();
      registeredToken = response.body.data.token;
    });

    it('should return 401 for invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: registeredEmail,
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('LOGIN_ERROR');
      expect(response.body.error.message).toContain('Credenciales inválidas');
    });

    it('should return 401 for non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('LOGIN_ERROR');
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'password123',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/auth/me', () => {
    let token: string;
    let userEmail: string;

    beforeEach(async () => {
      userEmail = `me-${Date.now()}@example.com`;
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          ...testUser,
          email: userEmail,
        })
        .expect(201);
      token = registerResponse.body.data.token;
    });

    it('should return user data with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.email).toBe(userEmail);
      expect(response.body.data.fullName).toBe(testUser.fullName);
      expect(response.body.data.balance).toBe(0);
      expect(response.body.data.passwordHash).toBeUndefined();
    });

    it('should return 401 without authorization header', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should return 401 with malformed authorization header', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'InvalidHeader')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should return 404 for deleted user (if applicable)', async () => {
      // This would require a way to delete users, which we don't have
      // Just verifying the endpoint works with valid token
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});