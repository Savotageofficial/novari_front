import { apiRequest } from '../lib/apiClient'
import type { ApiOrderPayload, ApiOrderResponse } from './types'

export async function submitOrder(
  payload: ApiOrderPayload
): Promise<ApiOrderResponse> {
  return apiRequest<ApiOrderResponse>('/api/orders/', {
    method: 'POST',
    body: payload,
  })
}
