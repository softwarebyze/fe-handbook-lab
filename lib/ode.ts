/** RK4 for x' = f(t, x). State is column vector. */

export type State = number[];

export function rk4Step(
  t: number,
  y: State,
  h: number,
  f: (t: number, y: State) => State
): State {
  const k1 = f(t, y);
  const k2 = f(t + h / 2, add(y, scale(k1, h / 2)));
  const k3 = f(t + h / 2, add(y, scale(k2, h / 2)));
  const k4 = f(t + h, add(y, scale(k3, h)));
  return add(y, scale(add(add(add(k1, scale(k2, 2)), scale(k3, 2)), k4), h / 6));
}

function add(a: State, b: State): State {
  return a.map((v, i) => v + b[i]);
}

function scale(a: State, s: number): State {
  return a.map((v) => v * s);
}

/** MSD: y = [x, v], x' = v, v' = -(c/m)v - (k/m)x */
export function msdDerivative(m: number, c: number, k: number) {
  return (_t: number, y: State): State => {
    const x = y[0];
    const v = y[1];
    const a = -(c / m) * v - (k / m) * x;
    return [v, a];
  };
}
