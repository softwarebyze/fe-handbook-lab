/** Unit step response of ωₙ²/(s² + 2ζωₙ s + ωₙ²), zero initial conditions. */

export function secondOrderStep(
  t: number,
  zeta: number,
  omegaN: number
): number {
  if (omegaN <= 0 || t < 0) return 0;
  const wn = omegaN;
  const z = zeta;

  if (z < 1 - 1e-9) {
    const wd = wn * Math.sqrt(1 - z * z);
    const e = Math.exp(-z * wn * t);
    return 1 - e * (Math.cos(wd * t) + (z * wn * Math.sin(wd * t)) / wd);
  }

  if (z > 1 + 1e-9) {
    // Overdamped: hyperbolic form (dual to underdamped cos/sin)
    const r = Math.sqrt(z * z - 1);
    const sig = wn * r;
    const e = Math.exp(-z * wn * t);
    return 1 - e * (Math.cosh(sig * t) + (z * wn * Math.sinh(sig * t)) / sig);
  }

  // Critical: 1 - e^{-wn t}(1 + wn t)
  const e = Math.exp(-wn * t);
  return 1 - e * (1 + wn * t);
}

export function firstOrderStep(t: number, tau: number): number {
  if (t < 0) return 0;
  if (tau <= 1e-9) return t > 0 ? 1 : 0;
  return 1 - Math.exp(-t / tau);
}
