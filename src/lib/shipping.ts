// Central shipping cost logic
// TEMPORARY: ALL shipping is FREE - was €6.95 (NL) and €18.95 (EU)

export const NL_SHIPPING = 0;  // TEMPORARY: Free shipping
export const EU_SHIPPING = 0;  // TEMPORARY: Free shipping
export const FREE_SHIPPING_THRESHOLD = 0;  // TEMPORARY: All orders get free shipping

export function isNL(country: string): boolean {
  const c = country?.toLowerCase().trim();
  return c === 'nl' || c === 'nederland' || c === 'netherlands' || c === 'the netherlands';
}

export function getShippingCost(cartTotal: number, country: string = 'NL'): number {
  if (isNL(country)) {
    return cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : NL_SHIPPING;
  }
  return EU_SHIPPING;
}

export function formatShippingCost(cost: number, locale: string = 'nl'): string {
  if (cost === 0) return locale === 'nl' ? 'Gratis' : 'Free';
  return `€${cost.toFixed(2)}`;
}
