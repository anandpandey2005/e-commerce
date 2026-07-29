/**
 * Combines class names cleanly.
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Formats a numeric value into USD currency format ($12,345.67).
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats standard numbers with comma separators.
 */
export function formatNumber(val: number): string {
  return new Intl.NumberFormat("en-US").format(val);
}
