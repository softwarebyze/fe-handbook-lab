import { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';

import { ParamSlider } from '@/components/ParamSlider';
import { TimeSeriesChart } from '@/components/charts/TimeSeriesChart';
import { firstOrderStep } from '@/lib/stepResponse';
import { useAppColors } from '@/hooks/useAppColors';

export function FirstOrderSim() {
  const { colors } = useAppColors();

  const [tau, setTau] = useState(1);
  const [chartW, setChartW] = useState(320);

  const series = useMemo(() => {
    const T = Math.max(5 * tau, 0.5);
    const n = 200;
    const pts: { t: number; y: number }[] = [];
    for (let i = 0; i <= n; i++) {
      const t = (T * i) / n;
      pts.push({ t, y: firstOrderStep(t, tau) });
    }
    return pts;
  }, [tau]);

  const onChartLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setChartW(w);
  };

  const rise63 = tau;

  return (
    <View style={styles.container}>
      <View style={[styles.callout, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.hint, { color: colors.text }]}>
          Normalized step toward 1. At t=τ, y≈0.632 — the “one time constant” rule used everywhere in
          FE-style lumped models.
        </Text>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          63% rise time ≈ {rise63.toFixed(2)} s
        </Text>
      </View>

      <ParamSlider
        label="Time constant τ (s)"
        value={tau}
        min={0.1}
        max={4}
        onChange={setTau}
        format={(v) => v.toFixed(2)}
      />

      <View style={styles.chartBox} onLayout={onChartLayout}>
        <TimeSeriesChart
          series={series}
          width={chartW}
          height={200}
          yLabel="y(t) = 1 − e^(−t/τ)"
          yMin={0}
          yMax={1.05}
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
  meta: { fontSize: 13, fontWeight: '700', marginTop: 10, fontVariant: ['tabular-nums'] },
  chartBox: { marginTop: 10, width: '100%' },
});
