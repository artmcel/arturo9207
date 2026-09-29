import { v4 as uuidv4 } from 'uuid';
import { SnailPayChargeRequest, SnailPayResponse, SnailPayStatus } from '@shared/types';
import {
  SNAILPAY_SUCCESS_CARD,
  SNAILPAY_DECLINED_CARDS,
  SNAILPAY_ERROR_CODES,
  SNAILPAY_ERROR_MESSAGES,
  SNAILPAY_SYSTEM_ERROR_HEADER,
  SNAILPAY_SYSTEM_ERROR_ENV,
} from '@shared/constants';

export class SnailPayService {
  private isSystemErrorMode = false;

  setSystemErrorMode(enabled: boolean) {
    this.isSystemErrorMode = enabled;
  }

  isSystemErrorEnabled(): boolean {
    if (this.isSystemErrorMode) return true;
    if (process.env[SNAILPAY_SYSTEM_ERROR_ENV] === 'true') return true;
    return false;
  }

  async charge(request: SnailPayChargeRequest, headers: Record<string, string | undefined>): Promise<SnailPayResponse> {
    const now = new Date().toISOString();
    const reference = `SNL-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    if (this.isSystemErrorEnabled() || headers[SNAILPAY_SYSTEM_ERROR_HEADER] === 'true') {
      return this.createErrorResponse(
        request,
        now,
        reference,
        SnailPayStatus.ERROR,
        SNAILPAY_ERROR_CODES.SYSTEM_ERROR,
        SNAILPAY_ERROR_MESSAGES[SNAILPAY_ERROR_CODES.SYSTEM_ERROR]
      );
    }

    const isSuccessCard =
      request.cardNumber === SNAILPAY_SUCCESS_CARD.number &&
      request.expiry === SNAILPAY_SUCCESS_CARD.expiry &&
      request.cvv === SNAILPAY_SUCCESS_CARD.cvv &&
      request.fullName.trim().length > 0 &&
      request.amount > 0;

    if (isSuccessCard) {
      return this.createSuccessResponse(request, now, reference);
    }

    if (SNAILPAY_DECLINED_CARDS.includes(request.cardNumber as typeof SNAILPAY_DECLINED_CARDS[number])) {
      return this.createErrorResponse(
        request,
        now,
        reference,
        SnailPayStatus.REJECTED,
        SNAILPAY_ERROR_CODES.DECLINED,
        SNAILPAY_ERROR_MESSAGES[SNAILPAY_ERROR_CODES.DECLINED]
      );
    }

    if (request.cardNumber !== SNAILPAY_SUCCESS_CARD.number) {
      return this.createErrorResponse(
        request,
        now,
        reference,
        SnailPayStatus.REJECTED,
        SNAILPAY_ERROR_CODES.INVALID_CARD,
        SNAILPAY_ERROR_MESSAGES[SNAILPAY_ERROR_CODES.INVALID_CARD]
      );
    }

    if (request.expiry !== SNAILPAY_SUCCESS_CARD.expiry) {
      return this.createErrorResponse(
        request,
        now,
        reference,
        SnailPayStatus.REJECTED,
        SNAILPAY_ERROR_CODES.EXPIRED_CARD,
        SNAILPAY_ERROR_MESSAGES[SNAILPAY_ERROR_CODES.EXPIRED_CARD]
      );
    }

    if (request.cvv !== SNAILPAY_SUCCESS_CARD.cvv) {
      return this.createErrorResponse(
        request,
        now,
        reference,
        SnailPayStatus.REJECTED,
        SNAILPAY_ERROR_CODES.INVALID_CVV,
        SNAILPAY_ERROR_MESSAGES[SNAILPAY_ERROR_CODES.INVALID_CVV]
      );
    }

    return this.createErrorResponse(
      request,
      now,
      reference,
      SnailPayStatus.REJECTED,
      SNAILPAY_ERROR_CODES.INSUFFICIENT_FUNDS,
      SNAILPAY_ERROR_MESSAGES[SNAILPAY_ERROR_CODES.INSUFFICIENT_FUNDS]
    );
  }

  private createSuccessResponse(request: SnailPayChargeRequest, dateCreated: string, reference: string): SnailPayResponse {
    return {
      id: uuidv4(),
      status: SnailPayStatus.APPROVED,
      status_detail: 'Operación aprobada',
      transaction_amount: request.amount,
      date_created: dateCreated,
      authorization_code: this.generateAuthCode(),
      reference,
      payer_id: request.userId,
      payer_email: request.userEmail,
    };
  }

  private createErrorResponse(
    request: SnailPayChargeRequest,
    dateCreated: string,
    reference: string,
    status: SnailPayStatus,
    _errorCode: string,
    statusDetail: string
  ): SnailPayResponse {
    return {
      id: uuidv4(),
      status,
      status_detail: statusDetail,
      transaction_amount: request.amount,
      date_created: dateCreated,
      authorization_code: null,
      reference,
      payer_id: request.userId,
      payer_email: request.userEmail,
    };
  }

  private generateAuthCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}

export const snailPayService = new SnailPayService();