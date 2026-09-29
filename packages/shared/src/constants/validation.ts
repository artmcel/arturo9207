export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  FULL_NAME_MIN_LENGTH: 2,
  FULL_NAME_MAX_LENGTH: 100,
  CARD_NUMBER_LENGTH: 16,
  CVV_LENGTH: 3,
  EXPIRY_REGEX: /^\d{2}\/\d{2}$/,
  AMOUNT_MIN: 0.01,
} as const;

export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  CARD_NUMBER: /^\d{16}$/,
  CVV: /^\d{3}$/,
  EXPIRY: /^(0[1-9]|1[0-2])\/\d{2}$/,
} as const;