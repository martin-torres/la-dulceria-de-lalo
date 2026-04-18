import { PaymentResult, CardPaymentData } from './types';

declare global {
  interface Window {
    Conekta?: {
      setPublicKey: (key: string) => void;
      token: {
        create: (
          tokenData: Record<string, unknown>,
          successHandler: (token: { id: string }) => void,
          errorHandler: (error: { message: string }) => void
        ) => void;
      };
    };
  }
}

interface ConektaConfig {
  publicKey: string;
  locale?: string;
}

let conektaInitialized = false;

export const initConekta = (config: ConektaConfig): void => {
  if (typeof window === 'undefined' || !window.Conekta) return;

  window.Conekta.setPublicKey(config.publicKey);
  conektaInitialized = true;
};

export const loadConektaScript = (publicKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Conekta can only be loaded in browser'));
      return;
    }

    if (window.Conekta) {
      initConekta({ publicKey });
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.conekta.io/js/latest/conekta.js';
    script.async = true;

    script.onload = () => {
      initConekta({ publicKey });
      resolve();
    };

    script.onerror = () => {
      reject(new Error('Failed to load Conekta'));
    };

    document.head.appendChild(script);
  });
};

export const processConektaPayment = async (
  amount: number,
  currency: string,
  cardData: CardPaymentData,
  publicKey: string,
  orderId: string
): Promise<PaymentResult> => {
  if (!window.Conekta) {
    return {
      success: false,
      error: 'Conekta no está cargado. Por favor recarga la página.',
    };
  }

  try {
    initConekta({ publicKey });

    const tokenData = {
      card: {
        number: cardData.cardNumber.replace(/\s/g, ''),
        cvc: cardData.cvv,
        exp_month: cardData.expMonth,
        exp_year: cardData.expYear,
        name: cardData.cardholderName,
      },
    };

    const token = await new Promise<string>((resolve, reject) => {
      window.Conekta!.token.create(
        tokenData,
        (success) => resolve(success.id),
        (error) => reject(new Error(error.message))
      );
    });

    return {
      success: true,
      transactionId: token,
      metadata: {
        orderId,
        token,
        amount,
        currency,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al procesar el pago',
    };
  }
};
