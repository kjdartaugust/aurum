export function formatUSD(value: number, opts?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    ...opts,
  }).format(value);
}

export function formatUSDPrecise(value: number): string {
  return formatUSD(value, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}
