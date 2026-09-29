import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatDateTime } from '@shared/utils';

describe('Shared Formatters', () => {
  describe('formatCurrency', () => {
    it('should format positive numbers correctly', () => {
      const result = formatCurrency(100);
      expect(result).toContain('100,00');
      expect(result).toContain('$');
    });

    it('should format with decimals', () => {
      const result = formatCurrency(1234.56);
      expect(result).toContain('1234,56');
      expect(result).toContain('$');
    });

    it('should format zero', () => {
      const result = formatCurrency(0);
      expect(result).toContain('0,00');
      expect(result).toContain('$');
    });

    it('should format with custom currency', () => {
      const result = formatCurrency(100, 'EUR');
      expect(result).toContain('100,00');
      expect(result).toContain('€');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15T12:00:00');
      const result = formatDate(date);
      expect(result).toContain('enero');
      expect(result).toContain('2024');
    });
  });

  describe('formatDateTime', () => {
    it('should format datetime correctly', () => {
      const date = new Date('2024-01-15T14:30:00');
      const result = formatDateTime(date);
      expect(result).toContain('14');
      expect(result).toContain('30');
    });
  });
});