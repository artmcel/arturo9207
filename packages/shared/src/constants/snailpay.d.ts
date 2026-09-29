export declare const SNAILPAY_SUCCESS_CARD: {
    readonly number: "1234123412341234";
    readonly expiry: "12/26";
    readonly cvv: "543";
};
export declare const SNAILPAY_DECLINED_CARDS: readonly ["4000000000000002", "4000000000000069", "4000000000000127"];
export declare const SNAILPAY_ERROR_CODES: {
    readonly INVALID_CARD: "INVALID_CARD";
    readonly EXPIRED_CARD: "EXPIRED_CARD";
    readonly INVALID_CVV: "INVALID_CVV";
    readonly DECLINED: "DECLINED";
    readonly INSUFFICIENT_FUNDS: "INSUFFICIENT_FUNDS";
    readonly SYSTEM_ERROR: "SYSTEM_ERROR";
};
export declare const SNAILPAY_ERROR_MESSAGES: {
    readonly INVALID_CARD: "Número de tarjeta inválido";
    readonly EXPIRED_CARD: "Tarjeta expirada";
    readonly INVALID_CVV: "CVV inválido";
    readonly DECLINED: "Tarjeta rechazada";
    readonly INSUFFICIENT_FUNDS: "Fondos insuficientes";
    readonly SYSTEM_ERROR: "Error del sistema SnailPay. Intente más tarde.";
};
export declare const SNAILPAY_SYSTEM_ERROR_HEADER = "x-snailpay-simulate-error";
export declare const SNAILPAY_SYSTEM_ERROR_ENV = "SNAILPAY_SIMULATE_SYSTEM_ERROR";
//# sourceMappingURL=snailpay.d.ts.map