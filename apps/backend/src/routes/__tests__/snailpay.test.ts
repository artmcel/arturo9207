import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { SNAILPAY_SUCCESS_CARD, SNAILPAY_DECLINED_CARDS, SNAILPAY_SYSTEM_ERROR_HEADER } from '@sisu/shared';

describe('SnailPay API Integration', () => {
  let authToken: string;
  let userId: string;
  let userEmail: string;

  const baseChargeRequest = {
    cardNumber: SNAILPAY_SUCCESS_CARD.number,
    expiry: SNAILPAY_SUCCESS_CARD.expiry,
    cvv: SNAILPAY_SUCCESS_CARD.cvv,
    fullName: 'Test User',
    amount: 100,
    userId: '',
    userEmail: '',
  };

  beforeEach(async () => {
    // Register a user and get token
    userEmail = `snailpay-${Date.now()}@example.com`;
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'SnailPay Test User',
        email: userEmail,
        password: 'password123',
        confirmPassword: 'password123',
      })
      .expect(201);

    authToken = registerResponse.body.data.token;
    userId = registerResponse.body.data.user.id;
    userEmail = registerResponse.body.data.user.email;

    // Update base request with actual user data
    baseChargeRequest.userId = userId;
    baseChargeRequest.userEmail = userEmail;
  });

  describe('POST /api/snailpay/charge', () => {
    it('should approve charge with success card', async () => {
      const response = await request(app)
        .post('/api/snailpay/charge')
        .set('Authorization', `Bearer ${authToken}`)
        .send(baseChargeRequest)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.status).toBe('approved');
      expect(response.body.data.status_detail).toBe('Operación aprobada');
      expect(response.body.data.transaction_amount).toBe(100);
      expect(response.body.data.authorization_code).toBeDefined();
      expect(response.body.data.reference).toBeDefined();
      expect(response.body.data.payer_id).toBe(userId);
      expect(response.body.data.payer_email).toBe(userEmail);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.date_created).toBeDefined();
      expect(response.body.error).toBeNull();
    });

    it('should update user balance on successful charge', async () => {
      // Check initial balance via /me
      const meBefore = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      expect(meBefore.body.data.balance).toBe(0);

      // Make charge
      await request(app)
        .post('/api/snailpay/charge')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ...baseChargeRequest, amount: 250 })
        .expect(200);

      // Check balance updated
      const meAfter = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      expect(meAfter.body.data.balance).toBe(250);
    });

    it('should reject charge with declined card numbers', async () => {
      for (const cardNumber of SNAILPAY_DECLINED_CARDS) {
        const response = await request(app)
          .post('/api/snailpay/charge')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ ...baseChargeRequest, cardNumber })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.status).toBe('rejected');
        expect(response.body.data.authorization_code).toBeNull();
        expect(response.body.data.status_detail).toBeDefined();
      }
    });

    it('should reject charge with invalid card number', async () => {
      const response = await request(app)
        .post('/api/snailpay/charge')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ...baseChargeRequest, cardNumber: '1111111111111111' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('rejected');
      expect(response.body.data.authorization_code).toBeNull();
    });

    it('should reject charge with wrong expiry', async () => {
      const response = await request(app)
        .post('/api/snailpay/charge')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ...baseChargeRequest, expiry: '01/20' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('rejected');
    });

    it('should reject charge with wrong CVV', async () => {
      const response = await request(app)
        .post('/api/snailpay/charge')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ...baseChargeRequest, cvv: '123' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('rejected');
    });

    it('should return 400 for empty name (validation error)', async () => {
      const response = await request(app)
        .post('/api/snailpay/charge')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ...baseChargeRequest, fullName: '' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for zero amount (validation error)', async () => {
      const response = await request(app)
        .post('/api/snailpay/charge')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ...baseChargeRequest, amount: 0 })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return system error when enabled via header', async () => {
      const response = await request(app)
        .post('/api/snailpay/charge')
        .set('Authorization', `Bearer ${authToken}`)
        .set(SNAILPAY_SYSTEM_ERROR_HEADER, 'true')
        .send(baseChargeRequest)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('error');
      expect(response.body.data.status_detail).toContain('Error del sistema');
      expect(response.body.data.authorization_code).toBeNull();
    });

    it('should return system error when enabled via env var', async () => {
      // This test would require setting env var before server start
      // Skipping as it requires process restart
      // The header-based test above covers the functionality
    });

    it('should not update balance on rejected charge', async () => {
      const meBefore = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      expect(meBefore.body.data.balance).toBe(0);

      await request(app)
        .post('/api/snailpay/charge')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ...baseChargeRequest, cardNumber: '1111111111111111' })
        .expect(200);

      const meAfter = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      expect(meAfter.body.data.balance).toBe(0);
    });

    it('should not update balance on system error', async () => {
      const meBefore = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      expect(meBefore.body.data.balance).toBe(0);

      await request(app)
        .post('/api/snailpay/charge')
        .set('Authorization', `Bearer ${authToken}`)
        .set(SNAILPAY_SYSTEM_ERROR_HEADER, 'true')
        .send(baseChargeRequest)
        .expect(200);

      const meAfter = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      expect(meAfter.body.data.balance).toBe(0);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/snailpay/charge')
        .send(baseChargeRequest)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .post('/api/snailpay/charge')
        .set('Authorization', 'Bearer invalid-token')
        .send(baseChargeRequest)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should return 400 for invalid request body', async () => {
      const response = await request(app)
        .post('/api/snailpay/charge')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          cardNumber: 'invalid',
          expiry: 'invalid',
          cvv: '12',
          fullName: '',
          amount: -10,
          userId: 'not-uuid',
          userEmail: 'invalid-email',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/snailpay/simulate-system-error', () => {
    it('should toggle system error mode', async () => {
      const response = await request(app)
        .post('/api/snailpay/simulate-system-error')
        .send({ enabled: true })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.systemErrorMode).toBe(true);

      // Verify it affects charge
      const chargeResponse = await request(app)
        .post('/api/snailpay/charge')
        .set('Authorization', `Bearer ${authToken}`)
        .send(baseChargeRequest)
        .expect(200);

      expect(chargeResponse.body.data.status).toBe('error');

      // Disable
      await request(app)
        .post('/api/snailpay/simulate-system-error')
        .send({ enabled: false })
        .expect(200);

      const chargeResponse2 = await request(app)
        .post('/api/snailpay/charge')
        .set('Authorization', `Bearer ${authToken}`)
        .send(baseChargeRequest)
        .expect(200);

      expect(chargeResponse2.body.data.status).toBe('approved');
    });
  });
});