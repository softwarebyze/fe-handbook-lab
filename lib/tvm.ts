/**
 * Time-value-of-money factors aligned with FE Reference Handbook §Engineering Economics.
 *
 * All functions assume discrete compounding with interest rate per period i and n periods.
 */

/** Single payment compound amount: (F/P, i, n) = (1+i)^n */
export function fGivenP(i: number, n: number): number {
  return Math.pow(1 + i, n);
}

/** Single payment present worth: (P/F, i, n) = 1/(1+i)^n */
export function pGivenF(i: number, n: number): number {
  return 1 / Math.pow(1 + i, n);
}

/** Uniform series sinking fund: (A/F, i, n) = i / [(1+i)^n − 1] */
export function aGivenF(i: number, n: number): number {
  if (i < 1e-12) return n > 0 ? 1 / n : 0;
  const f = Math.pow(1 + i, n) - 1;
  return i / f;
}

/** Uniform series compound amount: (F/A, i, n) = [(1+i)^n − 1] / i */
export function fGivenA(i: number, n: number): number {
  if (i < 1e-12) return n;
  return (Math.pow(1 + i, n) - 1) / i;
}

/** Uniform series capital recovery: (A/P, i, n) = i(1+i)^n / [(1+i)^n − 1] */
export function aGivenP(i: number, n: number): number {
  if (i < 1e-12) return n > 0 ? 1 / n : 0;
  const f = Math.pow(1 + i, n);
  return (i * f) / (f - 1);
}

/** Uniform series present worth: (P/A, i, n) = [(1+i)^n − 1] / [i(1+i)^n] */
export function pGivenA(i: number, n: number): number {
  if (i < 1e-12) return n;
  const f = Math.pow(1 + i, n);
  return (f - 1) / (i * f);
}

/**
 * Build a cash-flow series for plotting: shows the present value of $1 received at each period.
 * Useful for visualizing how far-future cash flows shrink.
 */
export function pvSeries(i: number, n: number): { t: number; y: number }[] {
  const pts: { t: number; y: number }[] = [];
  for (let k = 0; k <= n; k++) {
    pts.push({ t: k, y: pGivenF(i, k) });
  }
  return pts;
}
