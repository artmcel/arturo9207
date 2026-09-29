import { describe, it, expect } from 'vitest';
import { emailSchema, passwordSchema, validateCardExpiry, generateId, generateReference } from './validation';

describe('Shared Validation Utils', () => {
  describe('emailSchema', () => {
    it('should validate correct emails', () => {
      expect(emailSchema.parse('test@example.com')).toBe('test@example.com');
      expect(emailSchema.parse('user.name@domain.org')).toBe('user.name@domain.org');
    });

    it('should reject invalid emails', () => {
      expect(() => emailSchema.parse('invalid')).toThrow();
      expect(() => emailSchema.parse('test@')).toThrow();
      expect(() => emailSchema.parse('@domain.com')).toThrow();
    });
  });

  describe('passwordSchema', () => {
    it('should accept passwords with 8+ characters', () => {
      expect(passwordSchema.parse('password123')).toBe('password123');
      expect(passwordSchema.parse('12345678')).toBe('12345678');
    });

    it('should reject short passwords', () => {
      expect(() => passwordSchema.parse('short')).toThrow();
    });
  });

  describe('validateCardExpiry', () => {
    it('should validate future dates', () => {
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      const month = String(nextYear.getMonth() + 1).padStart(2, '0');
      const year = String(nextYear.getFullYear()).slice(-2);
      expect(validateCardExpiry(`${month}/${year}`)).toBe(true);
    });

    it('should reject past dates', () => {
      const lastYear = new Date();
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      const month = String(lastYear.getMonth() + 1).padStart(2, '0');
      const year = String(lastYear.getFullYear()).slice(-2);
      expect(validateCardExpiry(`${month}/${year}`)).toBe(false);
    });

    it('should reject invalid format', () => {
      expect(validateCardExpiry('13/25')).toBe(false);
      expect(validateCardExpiry('12/25/')).toBe(false);
      expect(validateCardExpiry('12-25')).toBe(false);
    });
  });

  describe('generateId', () => {
    it('should generate valid UUIDs', () => {
      const id = generateId();
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should generate unique IDs', () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        ids.add(generateId());
      }
      expect(ids.size).toBe(100);
    });
  });

  describe('generateReference', () => {
    it('should generate reference with correct prefix', () => {
      const ref = generateReference();
      expect(ref).toMatch(/^SNL-\d+-[A-Z0-9]+$/);
    });
  });
});