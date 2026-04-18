export interface Promotion {
  code: string;
  description: string;
  conditions: {
    orderBeforeHour?: number;
    orderAfterHour?: number;
    minOrderAmount?: number;
    daysOfWeek?: number[];
  };
  action: {
    type: 'free_item' | 'discount_percent' | 'discount_fixed';
    itemCode?: string;
    value?: number;
  };
}

export interface CutoffTime {
  lastOrderHour: number;
  enabled: boolean;
}

export interface AppliedPromotion {
  code: string;
  description: string;
  discount: number;
  freeItem?: {
    code: string;
    name: string;
  };
}

export interface PromotionCheckResult {
  eligible: boolean;
  promotions: AppliedPromotion[];
  cutoffWarning?: string;
}
