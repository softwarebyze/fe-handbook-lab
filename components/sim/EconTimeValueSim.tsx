import { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';

import { ParamSlider } from '@/components/ParamSlider';
import { TimeSeriesChart, type SeriesPoint } from '@/components/charts/TimeSeriesChart';
import { useAppColors } from '@/hooks/useAppColors';

/** F = P(1+i)^n compound growth with uniform annual equivalent A = P·(A/P, i, n). */
export function EconTimeValueSim() {
  const { colors } = useAppColors();

  const [P, setP] = useState(1000);
  const [i, setI] = useState(0.06);
  const [n, setN] = useState(10);
  const [chartW, setChartW] = useState(320);

  const factor = Math.pow(1 + i, n);
  const F = P * factor;
  const A = i > 1e-9 ? P * (i * factor) / (factor - 1) : P / Math.max(n, 1);
  const series = useMemo((): SeriesPoint[] => {
    const pts: SeriesPoint[] = [];
    for (let yr = 0; yr <= n; yr++) {
      const y = P * Math.pow(1 + i, yr);
      pts.push({ t: yr, y });
    }
    return pts;
  }, [P, i, n]);

  const onChartLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setChartW(w);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.callout, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.hint, { color: colors.text }]}>
          Time value of money: F = P(1+i)ⁿ. Sweep present worth, interest rate, and periods to
          build intuition for FE economics problems.
        </Text>
      </View>

      <ParamSlider
        label="Present worth P ($)"
        value={P}
        min={100}
        max={10000}
        step={100}
        onChange={setP}
        format={(v) => `$${v.toFixed(0)}`}
      />
      <ParamSlider
        label="Interest rate i (per period)"
        value={i}
        min={0.01}
        max={0.2}
        onChange={setI}
        format={(v) => `${(v * 100).toFixed(1)}%`}
      />
      <ParamSlider
        label="Periods n"
        value={n}
        min={1}
        max={30}
        step={1}
        onChange={setN}
        format={(v) => `${Math.round(v)}`}
      />

      <View style={[styles.readout, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>Future worth F</Text>
          <Text style={[styles.readVal, { color: colors.tint }]}>${F.toFixed(2)}</Text>
        </View>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>Uniform annual A</Text>
          <Text style={[styles.readVal, { color: colors.warning }]}>${A.toFixed(2)}</Text>
        </View>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>F/P factor</Text>
          <Text style={[styles.readVal, { color: colors.textSecondary }]}>{factor.toFixed(4)}</Text>
        </View>
      </View>

      <View style={styles.chartBox} onLayout={onChartLayout}>
        <TimeSeriesChart
          series={series}
          width={chartW}
          height={220}
          yLabel="Future value F = P(1+i)ⁿ over time"
          yMin={0}
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
  readout: { borderRadius: 14, borderWidth: 1, padding: 14, marginTop: 4 },
  readRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  readLabel: { fontSize: 13, fontWeight: '700' },
  readVal: { fontSize: 18, fontWeight: '800', fontVariant: ['tabular-nums'] },
  chartBox: { marginTop: 10, width: '100%' },
});
