import { api } from './api';
import { SnailPayChargeRequest, SnailPayResponse } from '@shared/types';

export const snailPayService = {
  async charge(data: SnailPayChargeRequest): Promise<SnailPayResponse> {
    const response = await api.post<SnailPayResponse>('/snailpay/charge', data);
    return response.data;
  },
};