import { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';

import { ParamSlider } from '@/components/ParamSlider';
import { TimeSeriesChart, type SeriesPoint } from '@/components/charts/TimeSeriesChart';
import { msdFreeResponse, msdSuggestedHorizon } from '@/lib/msdFree';
import { useAppColors } from '@/hooks/useAppColors';

const X0 = 1;
const V0 = 0;

/**
 * Analytic free response (no RK4 drift). Recomputes the whole trace when m, c, or k change.
 */
export function SpringDamperSim() {
  const { colors } = useAppColors();

  const [m, setM] = useState(1);
  const [c, setC] = useState(0.35);
  const [k, setK] = useState(12);
  const [chartW, setChartW] = useState(320);

  const wn = Math.sqrt(k / m);
  const zeta = c / (2 * Math.max(Math.sqrt(m * k), 1e-9));

  const series = useMemo((): SeriesPoint[] => {
    const T = msdSuggestedHorizon(m, c, k);
    const n = 320;
    const pts: SeriesPoint[] = [];
    for (let i = 0; i <= n; i++) {
      const t = (T * i) / n;
      const y = msdFreeResponse(t, X0, V0, m, c, k);
      pts.push({ t, y });
    }
    return pts;
  }, [m, c, k]);

  const onChartLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setChartW(w);
  };

  const regime =
    zeta < 1e-6 ? 'Undamped' : zeta < 1 - 1e-6 ? 'Underdamped' : zeta <= 1 + 1e-6 ? 'Critical' : 'Overdamped';

  return (
    <View style={styles.container}>
      <View style={[styles.callout, { backgroundColor: colors.heroOverlay, borderColor: colors.tint }]}>
        <Text style={[styles.hint, { color: colors.text }]}>
          Analytic solution to mẍ + cẋ + kx = 0 with x(0)=1, ẋ(0)=0. No numerical integration error—what
          you see is exactly the textbook response for your ζ and ωₙ.
        </Text>
        <Text style={[styles.regime, { color: colors.tint }]}>{regime}</Text>
      </View>
      <Text style={[styles.meta, { color: colors.textSecondary }]}>
        ωₙ = {wn.toFixed(3)} rad/s · ζ = {zeta.toFixed(4)}
      </Text>

      <ParamSlider label="Mass m (kg)" value={m} min={0.2} max={5} onChange={setM} />
      <ParamSlider label="Damping c (N·s/m)" value={c} min={0} max={3} onChange={setC} />
      <ParamSlider label="Stiffness k (N/m)" value={k} min={1} max={40} onChange={setK} />

      <View style={styles.chartBox} onLayout={onChartLayout}>
        <TimeSeriesChart
          series={series}
          width={chartW}
          height={210}
          yLabel="Displacement x (m)"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  callout: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 4,
  },
  hint: { fontSize: 14, lineHeight: 21, fontWeight: '500' },
  regime: { fontSize: 12, fontWeight: '800', marginTop: 8, letterSpacing: 0.8 },
  meta: { fontSize: 13, marginBottom: 4, fontVariant: ['tabular-nums'], fontWeight: '600' },
  chartBox: { marginTop: 10, width: '100%' },
});
