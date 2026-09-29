export const SNAILPAY_SUCCESS_CARD = {
    number: '1234123412341234',
    expiry: '12/26',
    cvv: '543',
};
export const SNAILPAY_DECLINED_CARDS = [
    '4000000000000002', // Declined
    '4000000000000069', // Expired
    '4000000000000127', // Incorrect CVV
];
export const SNAILPAY_ERROR_CODES = {
    INVALID_CARD: 'INVALID_CARD',
    EXPIRED_CARD: 'EXPIRED_CARD',
    INVALID_CVV: 'INVALID_CVV',
    DECLINED: 'DECLINED',
    INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
    SYSTEM_ERROR: 'SYSTEM_ERROR',
};
export const SNAILPAY_ERROR_MESSAGES = {
    [SNAILPAY_ERROR_CODES.INVALID_CARD]: 'Número de tarjeta inválido',
    [SNAILPAY_ERROR_CODES.EXPIRED_CARD]: 'Tarjeta expirada',
    [SNAILPAY_ERROR_CODES.INVALID_CVV]: 'CVV inválido',
    [SNAILPAY_ERROR_CODES.DECLINED]: 'Tarjeta rechazada',
    [SNAILPAY_ERROR_CODES.INSUFFICIENT_FUNDS]: 'Fondos insuficientes',
    [SNAILPAY_ERROR_CODES.SYSTEM_ERROR]: 'Error del sistema SnailPay. Intente más tarde.',
};
export const SNAILPAY_SYSTEM_ERROR_HEADER = 'x-snailpay-simulate-error';
export const SNAILPAY_SYSTEM_ERROR_ENV = 'SNAILPAY_SIMULATE_SYSTEM_ERROR';
