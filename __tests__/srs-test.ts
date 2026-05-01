import { applySm2, type SrsState } from '@/lib/srs';

const base: SrsState = {
  easeFactor: 2.5,
  intervalDays: 0,
  repetitions: 0,
  nextReviewMs: 0,
};

describe('applySm2', () => {
  const t0 = 1_700_000_000_000;

  test('again resets repetitions and schedules immediate review', () => {
    const prev: SrsState = {
      ...base,
      repetitions: 3,
      intervalDays: 10,
      easeFactor: 2.4,
    };
    const next = applySm2(prev, 'again', t0);
    expect(next.repetitions).toBe(0);
    expect(next.intervalDays).toBe(0);
    expect(next.nextReviewMs).toBe(t0);
    expect(next.easeFactor).toBeLessThan(prev.easeFactor);
  });

  test('good first success uses 1 day interval', () => {
    const next = applySm2(base, 'good', t0);
    expect(next.repetitions).toBe(1);
    expect(next.intervalDays).toBe(1);
    expect(next.nextReviewMs).toBe(t0 + 24 * 60 * 60 * 1000);
  });

  test('good second success uses 6 day interval', () => {
    const afterFirst = applySm2(base, 'good', t0);
    const next = applySm2(afterFirst, 'good', t0);
    expect(next.repetitions).toBe(2);
    expect(next.intervalDays).toBe(6);
  });
});
