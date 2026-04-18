import { PaymentResult, CoDiPaymentData } from './types';

interface CoDiConfig {
  baseUrl?: string;
}

const CODI_BASE_URL = 'https://api.codi.mx/v1';

export const generateCoDiQR = async (
  amount: number,
  currency: string,
  orderId: string,
  customerData: CoDiPaymentData,
  config?: CoDiConfig
): Promise<PaymentResult> => {
  try {
    const codiPayload = {
      amount,
      currency,
      orderId,
      customerEmail: customerData.customerEmail,
      customerPhone: customerData.customerPhone,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    };

    return {
      success: true,
      paymentUrl: `${config?.baseUrl || CODI_BASE_URL}/qr?order=${orderId}`,
      metadata: {
        orderId,
        amount,
        currency,
        provider: 'codi',
        expiresAt: codiPayload.expiresAt,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al generar código CoDi',
    };
  }
};

export const checkCoDiPaymentStatus = async (
  orderId: string,
  config?: CoDiConfig
): Promise<PaymentResult> => {
  try {
    return {
      success: false,
      metadata: {
        orderId,
        status: 'pending',
        provider: 'codi',
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al verificar estado del pago',
    };
  }
};
