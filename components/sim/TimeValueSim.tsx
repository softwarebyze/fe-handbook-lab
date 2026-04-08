import { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';

import { ParamSlider } from '@/components/ParamSlider';
import { TimeSeriesChart, type SeriesPoint } from '@/components/charts/TimeSeriesChart';
import { useAppColors } from '@/hooks/useAppColors';
import {
  fpFactor,
  pfFactor,
  apFactor,
  paFactor,
  compoundSeries,
  annuitySeries,
} from '@/lib/tvm';

export function TimeValueSim() {
  const { colors } = useAppColors();

  const [pv, setPv] = useState(1000);
  const [rate, setRate] = useState(0.06);
  const [n, setN] = useState(10);
  const [annualA, setAnnualA] = useState(200);
  const [chartW, setChartW] = useState(320);

  const nInt = Math.round(n);

  const fv = pv * fpFactor(rate, nInt);
  const pvOfFv = fv * pfFactor(rate, nInt);
  const payment = pv * apFactor(rate, nInt);
  const pvOfAnnuity = annualA * paFactor(rate, nInt);

  const lumpSeries = useMemo((): SeriesPoint[] => {
    return compoundSeries(pv, rate, nInt).map((p) => ({
      t: p.year,
      y: p.balance,
    }));
  }, [pv, rate, nInt]);

  const annSeries = useMemo((): SeriesPoint[] => {
    return annuitySeries(annualA, rate, nInt).map((p) => ({
      t: p.year,
      y: p.balance,
    }));
  }, [annualA, rate, nInt]);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setChartW(w);
  };

  const fmt = (v: number) => {
    if (Math.abs(v) >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
    if (Math.abs(v) >= 1e3) return `$${(v / 1e3).toFixed(2)}k`;
    return `$${v.toFixed(2)}`;
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.callout,
          { backgroundColor: colors.heroOverlay, borderColor: colors.tint },
        ]}>
        <Text style={[styles.hint, { color: colors.text }]}>
          Discrete compounding: F = P(1+i)ⁿ. Adjust present value, interest rate, and
          periods to see how money grows. The annuity chart shows uniform payments
          accumulating at the same rate.
        </Text>
      </View>

      <ParamSlider
        label="Present value P ($)"
        value={pv}
        min={100}
        max={10000}
        step={100}
        onChange={setPv}
        format={(v) => fmt(v)}
      />
      <ParamSlider
        label="Interest rate i (per period)"
        value={rate}
        min={0.005}
        max={0.2}
        onChange={setRate}
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

      <View
        style={[
          styles.readout,
          { borderColor: colors.border, backgroundColor: colors.surface },
        ]}>
        <ReadoutRow
          label="Future value F = P(F/P,i,n)"
          value={fmt(fv)}
          tintColor={colors.tint}
          mutedColor={colors.textMuted}
        />
        <ReadoutRow
          label="PV back-check P = F(P/F,i,n)"
          value={fmt(pvOfFv)}
          tintColor={colors.textSecondary}
          mutedColor={colors.textMuted}
        />
        <ReadoutRow
          label="Capital recovery A = P(A/P,i,n)"
          value={`${fmt(payment)}/period`}
          tintColor={colors.warning}
          mutedColor={colors.textMuted}
        />
      </View>

      <Text style={[styles.chartLabel, { color: colors.textSecondary }]}>
        Lump-sum growth: P → F
      </Text>
      <View style={styles.chartBox} onLayout={onLayout}>
        <TimeSeriesChart
          series={lumpSeries}
          width={chartW}
          height={200}
          yLabel="Balance ($)"
          yMin={0}
        />
      </View>

      <View style={styles.divider} />

      <ParamSlider
        label="Annual payment A ($)"
        value={annualA}
        min={50}
        max={2000}
        step={50}
        onChange={setAnnualA}
        format={(v) => fmt(v)}
      />

      <View
        style={[
          styles.readout,
          { borderColor: colors.border, backgroundColor: colors.surface },
        ]}>
        <ReadoutRow
          label="PV of annuity P = A(P/A,i,n)"
          value={fmt(pvOfAnnuity)}
          tintColor={colors.tint}
          mutedColor={colors.textMuted}
        />
      </View>

      <Text style={[styles.chartLabel, { color: colors.textSecondary }]}>
        Annuity accumulation: A → F
      </Text>
      <View style={styles.chartBox}>
        <TimeSeriesChart
          series={annSeries}
          width={chartW}
          height={200}
          yLabel="Accumulated ($)"
          yMin={0}
        />
      </View>
    </View>
  );
}

function ReadoutRow({
  label,
  value,
  tintColor,
  mutedColor,
}: {
  label: string;
  value: string;
  tintColor: string;
  mutedColor: string;
}) {
  return (
    <View style={styles.readRow}>
      <Text style={[styles.readLabel, { color: mutedColor }]}>{label}</Text>
      <Text style={[styles.readVal, { color: tintColor }]}>{value}</Text>
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
  readRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  readLabel: { fontSize: 12, fontWeight: '700', flex: 1 },
  readVal: {
    fontSize: 17,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    marginLeft: 8,
  },
  chartLabel: { fontSize: 13, fontWeight: '700', marginTop: 12 },
  chartBox: { marginTop: 4, width: '100%' },
  divider: { height: 1, marginVertical: 12 },
});
