import { Promotion, CutoffTime, AppliedPromotion, PromotionCheckResult } from './types';
import { MenuItem } from '../../core/types';

const isOrderWithinTimeWindow = (
  orderHour: number,
  conditions: Promotion['conditions']
): boolean => {
  if (conditions.orderBeforeHour && orderHour >= conditions.orderBeforeHour) {
    return false;
  }
  if (conditions.orderAfterHour && orderHour < conditions.orderAfterHour) {
    return false;
  }
  return true;
};

const isOrderDayEligible = (
  dayOfWeek: number,
  conditions: Promotion['conditions']
): boolean => {
  if (!conditions.daysOfWeek || conditions.daysOfWeek.length === 0) {
    return true;
  }
  return conditions.daysOfWeek.includes(dayOfWeek);
};

const isOrderAmountEligible = (
  orderTotal: number,
  conditions: Promotion['conditions']
): boolean => {
  if (conditions.minOrderAmount && orderTotal < conditions.minOrderAmount) {
    return false;
  }
  return true;
};

export const checkPromotionEligibility = (
  promotions: Promotion[],
  orderTotal: number,
  menuItems: MenuItem[],
  orderTime: Date = new Date()
): PromotionCheckResult => {
  const orderHour = orderTime.getHours();
  const orderDay = orderTime.getDay();

  const appliedPromotions: AppliedPromotion[] = [];

  for (const promo of promotions) {
    const isTimeEligible = isOrderWithinTimeWindow(orderHour, promo.conditions);
    const isDayEligible = isOrderDayEligible(orderDay, promo.conditions);
    const isAmountEligible = isOrderAmountEligible(orderTotal, promo.conditions);

    if (isTimeEligible && isDayEligible && isAmountEligible) {
      const appliedPromo: AppliedPromotion = {
        code: promo.code,
        description: promo.description,
        discount: 0,
      };

      if (promo.action.type === 'free_item' && promo.action.itemCode) {
        const freeItem = menuItems.find(item => item.id === promo.action.itemCode);
        if (freeItem) {
          appliedPromo.freeItem = {
            code: freeItem.id,
            name: freeItem.name,
          };
          appliedPromo.discount = freeItem.price;
        }
      } else if (promo.action.type === 'discount_percent' && promo.action.value) {
        appliedPromo.discount = (orderTotal * promo.action.value) / 100;
      } else if (promo.action.type === 'discount_fixed' && promo.action.value) {
        appliedPromo.discount = promo.action.value;
      }

      appliedPromotions.push(appliedPromo);
    }
  }

  return {
    eligible: appliedPromotions.length > 0,
    promotions: appliedPromotions,
  };
};

export const checkCutoffTimes = (
  cutoffTimes: { delivery?: CutoffTime; pickup?: CutoffTime },
  deliveryType: 'domicilio' | 'sucursal',
  orderTime: Date = new Date()
): { allowed: boolean; message?: string } => {
  const orderHour = orderTime.getHours();

  const relevantCutoff = deliveryType === 'domicilio'
    ? cutoffTimes.delivery
    : cutoffTimes.pickup;

  if (!relevantCutoff || !relevantCutoff.enabled) {
    return { allowed: true };
  }

  if (orderHour >= relevantCutoff.lastOrderHour) {
    const cutoffLabel = deliveryType === 'domicilio' ? 'entregas a domicilio' : 'recoger en sucursal';
    return {
      allowed: false,
      message: `Ya no aceptamos ${cutoffLabel} después de las ${relevantCutoff.lastOrderHour}:00. Por favor intenta mañana.`,
    };
  }

  const hoursRemaining = relevantCutoff.lastOrderHour - orderHour;
  if (hoursRemaining <= 2) {
    return {
      allowed: true,
      message: `¡Apúrate! Quedan ${hoursRemaining} hora(s) para pedir.`,
    };
  }

  return { allowed: true };
};

export const calculateTotalDiscount = (promotions: AppliedPromotion[]): number => {
  return promotions.reduce((total, promo) => total + promo.discount, 0);
};
