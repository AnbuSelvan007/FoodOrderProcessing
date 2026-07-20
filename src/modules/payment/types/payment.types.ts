// ─── Enums (mirror backend) ─────────────────────────────────

export enum PaymentMethod {
  UPI = 'UPI',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  NET_BANKING = 'NET_BANKING',
  WALLET = 'WALLET',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

// ─── Response DTOs ──────────────────────────────────────────

export interface PaymentResponse {
  id: number;
  orderId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId: string;
  gatewayReference: string;
  paidAt: string;
  failureReason: string;
}

// ─── Request DTOs ───────────────────────────────────────────

export interface CreatePaymentRequest {
  orderId: number;
  paymentMethod: PaymentMethod;
}

export interface UpdatePaymentStatusRequest {
  paymentStatus: PaymentStatus;
  gatewayReference?: string;
  failureReason?: string;
}
