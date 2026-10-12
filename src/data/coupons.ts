import { Coupon } from '../types';

export const DEMO_COUPONS: Coupon[] = [
  {
    code: 'WELCOME100',
    discountType: 'flat',
    value: 100,
    description: 'Flat ₹100 OFF on your first booking',
    minBookingValue: 400,
  },
  {
    code: 'FESTIVE20',
    discountType: 'percentage',
    value: 20,
    maxDiscount: 500,
    description: '20% OFF up to ₹500 for festive celebrations',
    minBookingValue: 800,
  },
  {
    code: 'SUPERVIP',
    discountType: 'flat',
    value: 300,
    description: 'Flat ₹300 OFF on Premium & VIP passes',
    minBookingValue: 1200,
  },
  {
    code: 'TICKETEASE',
    discountType: 'percentage',
    value: 10,
    maxDiscount: 250,
    description: '10% OFF on all events',
    minBookingValue: 300,
  },
];

export function applyCoupon(code: string, subtotal: number): { valid: boolean; discount: number; message: string; coupon?: Coupon } {
  const coupon = DEMO_COUPONS.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
  
  if (!coupon) {
    return { valid: false, discount: 0, message: 'Invalid coupon code. Try WELCOME100 or FESTIVE20' };
  }

  if (subtotal < coupon.minBookingValue) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum order value of ₹${coupon.minBookingValue} required for ${coupon.code}`,
    };
  }

  let discount = 0;
  if (coupon.discountType === 'flat') {
    discount = coupon.value;
  } else {
    discount = Math.round((subtotal * coupon.value) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  }

  return {
    valid: true,
    discount,
    message: `Coupon ${coupon.code} applied successfully! Saved ₹${discount}`,
    coupon,
  };
}
