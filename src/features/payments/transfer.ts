import { PaymentResult, TransferProofData } from './types';

interface TransferConfig {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  clabe?: string;
}

export const getTransferInfo = (config: TransferConfig): TransferConfig => {
  return {
    bankName: config.bankName || 'Banco no especificado',
    accountNumber: config.accountNumber || '',
    accountHolder: config.accountHolder || '',
    clabe: config.clabe,
  };
};

export const validateTransferProof = (proof: TransferProofData): { valid: boolean; error?: string } => {
  if (!proof.file) {
    return { valid: false, error: 'Debes subir una imagen del comprobante' };
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (!allowedTypes.includes(proof.file.type)) {
    return { valid: false, error: 'El archivo debe ser una imagen (JPG, PNG, WEBP) o PDF' };
  }

  const maxSize = 5 * 1024 * 1024;
  if (proof.file.size > maxSize) {
    return { valid: false, error: 'El archivo no puede ser mayor a 5MB' };
  }

  return { valid: true };
};

export const submitTransferProof = async (
  orderId: string,
  proof: TransferProofData
): Promise<PaymentResult> => {
  const validation = validateTransferProof(proof);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
    };
  }

  try {
    return {
      success: true,
      transactionId: `transfer_${orderId}_${Date.now()}`,
      metadata: {
        orderId,
        proofType: proof.type,
        bankName: proof.bankName,
        authorizationCode: proof.authorizationCode,
        fileName: proof.file.name,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al enviar comprobante',
    };
  }
};
