// Central shipping cost logic
// NL: €6.95, free above €150
// EU (non-NL): €18.95, always paid

export const NL_SHIPPING = 6.95;
export const EU_SHIPPING = 18.95;
export const FREE_SHIPPING_THRESHOLD = 150;

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
