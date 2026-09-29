import { api } from './api';
import { SnailPayChargeRequest, SnailPayResponse, ApiResponse } from '@shared/types';

export const snailPayService = {
  async charge(data: SnailPayChargeRequest): Promise<SnailPayResponse> {
    const response = await api.post<ApiResponse<SnailPayResponse>>('/snailpay/charge', data);
    return response.data.data!;
  },
};