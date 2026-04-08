/**
 * Time-value-of-money factors from FE Reference Handbook §Engineering Economics.
 * All assume discrete compounding with rate i per period over n periods.
 */

/** (F/P, i, n) = (1 + i)^n — single payment compound amount */
export function fpFactor(i: number, n: number): number {
  return Math.pow(1 + i, n);
}

/** (P/F, i, n) = 1 / (1 + i)^n — single payment present worth */
export function pfFactor(i: number, n: number): number {
  return 1 / fpFactor(i, n);
}

/** (A/P, i, n) — uniform series capital recovery */
export function apFactor(i: number, n: number): number {
  if (Math.abs(i) < 1e-12) return n > 0 ? 1 / n : 0;
  const q = Math.pow(1 + i, n);
  return (i * q) / (q - 1);
}

/** (P/A, i, n) — uniform series present worth */
export function paFactor(i: number, n: number): number {
  if (Math.abs(i) < 1e-12) return n;
  const q = Math.pow(1 + i, n);
  return (q - 1) / (i * q);
}

/** (F/A, i, n) — uniform series compound amount (sinking fund inverse) */
export function faFactor(i: number, n: number): number {
  if (Math.abs(i) < 1e-12) return n;
  return (Math.pow(1 + i, n) - 1) / i;
}

/** (A/F, i, n) — sinking fund */
export function afFactor(i: number, n: number): number {
  if (Math.abs(i) < 1e-12) return n > 0 ? 1 / n : 0;
  return i / (Math.pow(1 + i, n) - 1);
}

/** Build a year-by-year balance series for a present value growing at rate i. */
export function compoundSeries(
  pv: number,
  i: number,
  n: number
): { year: number; balance: number }[] {
  const pts: { year: number; balance: number }[] = [];
  for (let k = 0; k <= n; k++) {
    pts.push({ year: k, balance: pv * Math.pow(1 + i, k) });
  }
  return pts;
}

/** Build a year-by-year balance series for uniform annual payments A at rate i. */
export function annuitySeries(
  a: number,
  i: number,
  n: number
): { year: number; balance: number }[] {
  const pts: { year: number; balance: number }[] = [{ year: 0, balance: 0 }];
  let bal = 0;
  for (let k = 1; k <= n; k++) {
    bal = bal * (1 + i) + a;
    pts.push({ year: k, balance: bal });
  }
  return pts;
}
