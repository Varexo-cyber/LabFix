// MobileSentrix geeft de voorraadstatus niet in één vast veld terug:
// is_in_stock komt als getal (0/1), soms als string, in_stock_qty is het
// aantal, en is_saleable zegt of het product überhaupt verkocht mag worden.
// Eén plek waar dat wordt uitgelegd, zodat de import en de synchronisatie
// nooit uit elkaar kunnen lopen.

export interface ResolvedStock {
  inStock: boolean;
  qty: number;
}

export function resolveStock(raw: any): ResolvedStock {
  const qty = Number.parseInt(String(raw?.in_stock_qty ?? raw?.stock_qty ?? raw?.qty ?? '0'), 10) || 0;

  const flag = raw?.is_in_stock;
  const flagged = flag === true || flag === 1 || flag === '1';
  const saleable = raw?.is_saleable === true || raw?.is_saleable === 1 || raw?.is_saleable === '1';

  return { inStock: flagged || saleable || qty > 0, qty };
}
