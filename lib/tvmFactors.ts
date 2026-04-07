/**
 * Time Value of Money factors from FE Reference Handbook §Engineering Economics.
 * All assume discrete compounding with interest rate i per period over n periods.
 */

/** Single-payment compound-amount: (F/P, i, n) = (1+i)^n */
export function fpFactor(i: number, n: number): number {
  return Math.pow(1 + i, n);
}

/** Single-payment present-worth: (P/F, i, n) = 1/(1+i)^n */
export function pfFactor(i: number, n: number): number {
  return 1 / Math.pow(1 + i, n);
}

/** Uniform-series sinking-fund: (A/F, i, n) = i / [(1+i)^n − 1] */
export function afFactor(i: number, n: number): number {
  if (i < 1e-12) return n > 0 ? 1 / n : 0;
  const c = Math.pow(1 + i, n);
  return i / (c - 1);
}

/** Uniform-series compound-amount: (F/A, i, n) = [(1+i)^n − 1] / i */
export function faFactor(i: number, n: number): number {
  if (i < 1e-12) return n;
  const c = Math.pow(1 + i, n);
  return (c - 1) / i;
}

/** Uniform-series present-worth: (P/A, i, n) = [(1+i)^n − 1] / [i(1+i)^n] */
export function paFactor(i: number, n: number): number {
  if (i < 1e-12) return n;
  const c = Math.pow(1 + i, n);
  return (c - 1) / (i * c);
}

/** Capital-recovery: (A/P, i, n) = [i(1+i)^n] / [(1+i)^n − 1] */
export function apFactor(i: number, n: number): number {
  if (i < 1e-12) return n > 0 ? 1 / n : 0;
  const c = Math.pow(1 + i, n);
  return (i * c) / (c - 1);
}

export interface TvmRow {
  label: string;
  notation: string;
  value: number;
}

export function allTvmFactors(i: number, n: number): TvmRow[] {
  return [
    { label: 'Single-payment compound amount', notation: '(F/P, i, n)', value: fpFactor(i, n) },
    { label: 'Single-payment present worth', notation: '(P/F, i, n)', value: pfFactor(i, n) },
    { label: 'Sinking fund', notation: '(A/F, i, n)', value: afFactor(i, n) },
    { label: 'Uniform-series compound amount', notation: '(F/A, i, n)', value: faFactor(i, n) },
    { label: 'Uniform-series present worth', notation: '(P/A, i, n)', value: paFactor(i, n) },
    { label: 'Capital recovery', notation: '(A/P, i, n)', value: apFactor(i, n) },
  ];
}
