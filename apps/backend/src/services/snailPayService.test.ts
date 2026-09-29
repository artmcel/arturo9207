import { describe, it, expect, beforeEach } from 'vitest';
import { snailPayService } from '../services/snailPayService';
import { SnailPayStatus } from '@shared/types';
import {
  SNAILPAY_SUCCESS_CARD,
  SNAILPAY_DECLINED_CARDS,
  SNAILPAY_SYSTEM_ERROR_HEADER,
} from '@shared/constants';

describe('SnailPayService', () => {
  const baseRequest = {
    cardNumber: SNAILPAY_SUCCESS_CARD.number,
    expiry: SNAILPAY_SUCCESS_CARD.expiry,
    cvv: SNAILPAY_SUCCESS_CARD.cvv,
    fullName: 'Test User',
    amount: 100,
    userId: 'user-123',
    userEmail: 'test@example.com',
  };

  beforeEach(() => {
    snailPayService.setSystemErrorMode(false);
  });

  describe('charge - success', () => {
    it('should approve with correct test card data', async () => {
      const result = await snailPayService.charge(baseRequest, {});
      expect(result.status).toBe(SnailPayStatus.APPROVED);
      expect(result.authorization_code).toBeDefined();
      expect(result.transaction_amount).toBe(100);
    });

    it('should include all required fields in response', async () => {
      const result = await snailPayService.charge(baseRequest, {});
      expect(result.id).toBeDefined();
      expect(result.status_detail).toBe('Operación aprobada');
      expect(result.date_created).toBeDefined();
      expect(result.reference).toBeDefined();
      expect(result.payer_id).toBe('user-123');
      expect(result.payer_email).toBe('test@example.com');
    });
  });

  describe('charge - declined cards', () => {
    it('should reject declined card numbers', async () => {
      for (const cardNumber of SNAILPAY_DECLINED_CARDS) {
        const result = await snailPayService.charge({ ...baseRequest, cardNumber }, {});
        expect(result.status).toBe(SnailPayStatus.REJECTED);
        expect(result.authorization_code).toBeNull();
      }
    });
  });

  describe('charge - invalid data', () => {
    it('should reject wrong card number', async () => {
      const result = await snailPayService.charge({ ...baseRequest, cardNumber: '1111111111111111' }, {});
      expect(result.status).toBe(SnailPayStatus.REJECTED);
    });

    it('should reject wrong expiry', async () => {
      const result = await snailPayService.charge({ ...baseRequest, expiry: '01/20' }, {});
      expect(result.status).toBe(SnailPayStatus.REJECTED);
    });

    it('should reject wrong CVV', async () => {
      const result = await snailPayService.charge({ ...baseRequest, cvv: '123' }, {});
      expect(result.status).toBe(SnailPayStatus.REJECTED);
    });

    it('should reject empty name', async () => {
      const result = await snailPayService.charge({ ...baseRequest, fullName: '' }, {});
      expect(result.status).toBe(SnailPayStatus.REJECTED);
    });

    it('should reject zero amount', async () => {
      const result = await snailPayService.charge({ ...baseRequest, amount: 0 }, {});
      expect(result.status).toBe(SnailPayStatus.REJECTED);
    });
  });

  describe('charge - system error', () => {
    it('should return system error when enabled via method', async () => {
      snailPayService.setSystemErrorMode(true);
      const result = await snailPayService.charge(baseRequest, {});
      expect(result.status).toBe(SnailPayStatus.ERROR);
      expect(result.status_detail).toContain('Error del sistema');
    });

    it('should return system error when enabled via header', async () => {
      const result = await snailPayService.charge(baseRequest, { [SNAILPAY_SYSTEM_ERROR_HEADER]: 'true' });
      expect(result.status).toBe(SnailPayStatus.ERROR);
    });
  });
});