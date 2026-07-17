export function formatNumber(n: number, decimals = 2): string {
  if (!isFinite(n) || isNaN(n)) return '—';
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

export function formatCurrency(n: number, currency = 'USD'): string {
  if (!isFinite(n) || isNaN(n)) return '—';
  try {
    return n.toLocaleString('en-US', { style: 'currency', currency, maximumFractionDigits: 2 });
  } catch {
    return `${formatNumber(n, 2)} ${currency}`;
  }
}

export function formatPercent(n: number, decimals = 1): string {
  if (!isFinite(n) || isNaN(n)) return '—';
  return `${n.toFixed(decimals)}%`;
}
