export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface CardPaymentData {
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvv: string;
  cardholderName: string;
  email: string;
  phone?: string;
}

export interface TransferProofData {
  type: 'transfer_screenshot' | 'bank_receipt' | 'atm_receipt';
  file: File;
  bankName: string;
  authorizationCode?: string;
}

export interface CoDiPaymentData {
  customerEmail: string;
  customerPhone: string;
}
