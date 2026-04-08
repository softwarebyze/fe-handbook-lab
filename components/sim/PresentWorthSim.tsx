import { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';

import { ParamSlider } from '@/components/ParamSlider';
import { TimeSeriesChart, type SeriesPoint } from '@/components/charts/TimeSeriesChart';
import { useAppColors } from '@/hooks/useAppColors';
import { pGivenF, fGivenP, pGivenA, aGivenP, fGivenA, aGivenF } from '@/lib/tvm';

export function PresentWorthSim() {
  const { colors } = useAppColors();

  const [i, setI] = useState(0.06);
  const [n, setN] = useState(10);
  const [chartW, setChartW] = useState(320);

  const nInt = Math.round(n);

  const factors = useMemo(
    () => ({
      fpfi: fGivenP(i, nInt),
      pffi: pGivenF(i, nInt),
      pafi: pGivenA(i, nInt),
      apfi: aGivenP(i, nInt),
      fafi: fGivenA(i, nInt),
      affi: aGivenF(i, nInt),
    }),
    [i, nInt]
  );

  const series = useMemo((): SeriesPoint[] => {
    const pts: SeriesPoint[] = [];
    for (let k = 0; k <= nInt; k++) {
      pts.push({ t: k, y: pGivenF(i, k) });
    }
    return pts;
  }, [i, nInt]);

  const onChartLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setChartW(w);
  };

  const pct = (i * 100).toFixed(2);

  return (
    <View style={styles.container}>
      <View style={[styles.callout, { backgroundColor: colors.heroOverlay, borderColor: colors.tint }]}>
        <Text style={[styles.hint, { color: colors.text }]}>
          FE economics factors at a glance. The chart shows how $1 received at period k
          shrinks in present value as k grows — the core of discounted cash-flow thinking.
        </Text>
      </View>

      <ParamSlider
        label="Interest rate i"
        value={i}
        min={0.005}
        max={0.2}
        onChange={setI}
        format={(v) => `${(v * 100).toFixed(2)}%`}
      />
      <ParamSlider
        label="Periods n"
        value={n}
        min={1}
        max={40}
        step={1}
        onChange={setN}
        format={(v) => `${Math.round(v)}`}
      />

      <View style={[styles.factorGrid, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <Text style={[styles.gridTitle, { color: colors.text }]}>
          Factors at i = {pct}%, n = {nInt}
        </Text>
        <FactorRow label="(F/P)" desc="compound amount" value={factors.fpfi} colors={colors} />
        <FactorRow label="(P/F)" desc="present worth" value={factors.pffi} colors={colors} />
        <FactorRow label="(P/A)" desc="series present worth" value={factors.pafi} colors={colors} />
        <FactorRow label="(A/P)" desc="capital recovery" value={factors.apfi} colors={colors} />
        <FactorRow label="(F/A)" desc="series compound" value={factors.fafi} colors={colors} />
        <FactorRow label="(A/F)" desc="sinking fund" value={factors.affi} colors={colors} />
      </View>

      <View style={styles.chartBox} onLayout={onChartLayout}>
        <TimeSeriesChart
          series={series}
          width={chartW}
          height={210}
          yLabel="Present value of $1 at period k"
          yMin={0}
          yMax={1.05}
        />
      </View>
    </View>
  );
}

function FactorRow({
  label,
  desc,
  value,
  colors,
}: {
  label: string;
  desc: string;
  value: number;
  colors: Record<string, string>;
}) {
  return (
    <View style={styles.factorRow}>
      <View style={styles.factorLeft}>
        <Text style={[styles.factorLabel, { color: colors.tint }]}>{label}</Text>
        <Text style={[styles.factorDesc, { color: colors.textSecondary }]}>{desc}</Text>
      </View>
      <Text style={[styles.factorVal, { color: colors.text }]}>{value.toFixed(4)}</Text>
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
  factorGrid: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginTop: 8,
  },
  gridTitle: { fontSize: 14, fontWeight: '800', marginBottom: 10 },
  factorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  factorLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  factorLabel: { fontSize: 14, fontWeight: '800', fontVariant: ['tabular-nums'], minWidth: 40 },
  factorDesc: { fontSize: 12, fontWeight: '500' },
  factorVal: { fontSize: 15, fontWeight: '700', fontVariant: ['tabular-nums'] },
  chartBox: { marginTop: 10, width: '100%' },
});
