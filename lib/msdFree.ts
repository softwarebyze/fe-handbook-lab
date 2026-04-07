/**
 * Free vibration of m x'' + c x' + k x = 0 with x(0)=x0, x'(0)=v0.
 * Uses ζ = c / (2√(mk)) and ωₙ = √(k/m). Matches standard FE dynamics forms.
 */

export function msdFreeResponse(
  t: number,
  x0: number,
  v0: number,
  m: number,
  c: number,
  k: number
): number {
  if (m <= 0 || k <= 0) return x0;
  const wn = Math.sqrt(k / m);
  const z = c / (2 * Math.sqrt(m * k));

  // Undamped (treat tiny ζ as 0 for numerical cleanliness)
  if (z < 1e-7) {
    return x0 * Math.cos(wn * t) + (v0 / wn) * Math.sin(wn * t);
  }

  // Underdamped
  if (z < 1 - 1e-9) {
    const wd = wn * Math.sqrt(1 - z * z);
    const e = Math.exp(-z * wn * t);
    return e * (x0 * Math.cos(wd * t) + ((v0 + z * wn * x0) / wd) * Math.sin(wd * t));
  }

  // Overdamped (test before critical band to match step-response thresholds)
  if (z > 1 + 1e-9) {
    const r = Math.sqrt(z * z - 1);
    const s1 = (-z + r) * wn;
    const s2 = (-z - r) * wn;
    const den = s1 - s2;
    const c1 = (v0 - s2 * x0) / den;
    const c2 = (s1 * x0 - v0) / den;
    return c1 * Math.exp(s1 * t) + c2 * Math.exp(s2 * t);
  }

  // Critical (ζ ≈ 1)
  const e = Math.exp(-wn * t);
  return e * (x0 + (v0 + wn * x0) * t);
}

/** Suggested window length (s) to show several cycles or decay. */
export function msdSuggestedHorizon(m: number, c: number, k: number): number {
  if (m <= 0 || k <= 0) return 5;
  const wn = Math.sqrt(k / m);
  const z = c / (2 * Math.sqrt(m * k));
  if (z < 0.05) {
    return Math.min(15, Math.max(2, (4 * 2 * Math.PI) / wn));
  }
  if (z < 1) {
    const wd = wn * Math.sqrt(Math.max(1 - z * z, 1e-9));
    return Math.min(15, Math.max(1.5, (3 * 2 * Math.PI) / wd));
  }
  // Heavier damping: ~4/(ζ ωₙ) to see settle
  const settle = 4 / Math.max(z * wn, 0.05);
  return Math.min(15, Math.max(1.5, settle));
}
