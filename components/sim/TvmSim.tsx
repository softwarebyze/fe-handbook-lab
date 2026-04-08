import { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';

import { ParamSlider } from '@/components/ParamSlider';
import { useAppColors } from '@/hooks/useAppColors';

/**
 * Compound-interest factor helpers (FE Handbook §Engineering Economics).
 * F/P = (1+i)^n, P/F = 1/(1+i)^n, F/A and P/A for uniform series.
 */
function fpFactor(i: number, n: number) {
  return Math.pow(1 + i, n);
}
function pfFactor(i: number, n: number) {
  return 1 / Math.pow(1 + i, n);
}
function faFactor(i: number, n: number) {
  if (i === 0) return n;
  return (Math.pow(1 + i, n) - 1) / i;
}
function paFactor(i: number, n: number) {
  if (i === 0) return n;
  const comp = Math.pow(1 + i, n);
  return (comp - 1) / (i * comp);
}
function apFactor(i: number, n: number) {
  if (i === 0) return n > 0 ? 1 / n : 0;
  const comp = Math.pow(1 + i, n);
  return (i * comp) / (comp - 1);
}

export function TvmSim() {
  const { colors } = useAppColors();
  const [pv, setPv] = useState(1000);
  const [rate, setRate] = useState(6);
  const [periods, setPeriods] = useState(10);
  const [barW, setBarW] = useState(280);

  const i = rate / 100;
  const n = Math.round(periods);

  const fv = pv * fpFactor(i, n);
  const totalInterest = fv - pv;
  const pa = paFactor(i, n);
  const fa = faFactor(i, n);
  const ap = apFactor(i, n);

  const balances = useMemo(() => {
    const arr = new Array(n + 1);
    for (let t = 0; t <= n; t++) arr[t] = pv * fpFactor(i, t);
    return arr;
  }, [pv, i, n]);

  const maxBal = Math.max(...balances, 1);

  const onBarLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setBarW(w);
  };

  const barH = 160;
  const barPad = 4;
  const usableW = barW - barPad * 2;
  const usableH = barH - barPad * 2;
  const gapFrac = 0.3;
  const slotW = n > 0 ? usableW / (n + 1) : usableW;
  const colW = slotW * (1 - gapFrac);
  const gapW = slotW * gapFrac;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.callout,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}>
        <Text style={[styles.hint, { color: colors.text }]}>
          Compound interest: F = P(1+i)^n. Slide the rate or periods and watch
          the future value and factor table update.
        </Text>
      </View>

      <ParamSlider
        label="Present Value P"
        value={pv}
        min={100}
        max={10000}
        step={100}
        onChange={setPv}
        format={(v) => `$${v.toLocaleString()}`}
      />
      <ParamSlider
        label="Interest rate i"
        value={rate}
        min={0}
        max={20}
        onChange={setRate}
        format={(v) => `${v.toFixed(1)}%`}
      />
      <ParamSlider
        label="Periods n"
        value={periods}
        min={1}
        max={30}
        step={1}
        onChange={setPeriods}
        format={(v) => `${Math.round(v)}`}
      />

      <View
        style={[
          styles.readout,
          { borderColor: colors.border, backgroundColor: colors.surface },
        ]}>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>
            Future Value F
          </Text>
          <Text style={[styles.readVal, { color: colors.tint }]}>
            ${fv.toFixed(2)}
          </Text>
        </View>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>
            Total Interest
          </Text>
          <Text style={[styles.readVal, { color: colors.warning }]}>
            ${totalInterest.toFixed(2)}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.factorBox,
          { borderColor: colors.border, backgroundColor: colors.surface },
        ]}>
        <Text style={[styles.factorTitle, { color: colors.text }]}>
          Interest Factors
        </Text>
        <View style={styles.factorGrid}>
          <FactorRow
            label="(F/P, i, n)"
            value={fpFactor(i, n)}
            colors={colors}
          />
          <FactorRow
            label="(P/F, i, n)"
            value={pfFactor(i, n)}
            colors={colors}
          />
          <FactorRow label="(F/A, i, n)" value={fa} colors={colors} />
          <FactorRow label="(P/A, i, n)" value={pa} colors={colors} />
          <FactorRow label="(A/P, i, n)" value={ap} colors={colors} />
        </View>
      </View>

      <Text style={[styles.barCap, { color: colors.textSecondary }]}>
        Balance over {n} periods
      </Text>
      <View style={styles.barTrack} onLayout={onBarLayout}>
        <Svg width={barW} height={barH}>
          <Rect
            x={0}
            y={0}
            width={barW}
            height={barH}
            rx={8}
            fill={colors.chartFill}
            stroke={colors.border}
          />
          {/* Principal baseline */}
          {n > 0 && (
            <Line
              x1={barPad}
              y1={barPad + usableH * (1 - pv / maxBal)}
              x2={barPad + usableW}
              y2={barPad + usableH * (1 - pv / maxBal)}
              stroke={colors.chartZeroLine}
              strokeDasharray="4,4"
              strokeWidth={1}
            />
          )}
          {balances.map((bal, idx) => {
            const h = (bal / maxBal) * usableH;
            const x = barPad + idx * slotW + gapW / 2;
            const y = barPad + usableH - h;
            const interestH = ((bal - pv) / maxBal) * usableH;
            const principalH = h - interestH;
            return (
              <React.Fragment key={idx}>
                <Rect
                  x={x}
                  y={y + interestH}
                  width={Math.max(1, colW)}
                  height={Math.max(0, principalH)}
                  rx={2}
                  fill={colors.tint}
                />
                {interestH > 0 && (
                  <Rect
                    x={x}
                    y={y}
                    width={Math.max(1, colW)}
                    height={Math.max(0, interestH)}
                    rx={2}
                    fill={colors.warning}
                    opacity={0.75}
                  />
                )}
              </React.Fragment>
            );
          })}
        </Svg>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendSwatch, { backgroundColor: colors.tint }]} />
            <Text style={[styles.legendText, { color: colors.textMuted }]}>
              Principal
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendSwatch, { backgroundColor: colors.warning, opacity: 0.75 }]}
            />
            <Text style={[styles.legendText, { color: colors.textMuted }]}>
              Interest
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

import React from 'react';
import type { AppColors } from '@/constants/Colors';

function FactorRow({
  label,
  value,
  colors,
}: {
  label: string;
  value: number;
  colors: AppColors;
}) {
  return (
    <View style={styles.fRow}>
      <Text style={[styles.fLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <Text style={[styles.fVal, { color: colors.tint }]}>
        {value.toFixed(4)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  callout: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 4,
  },
  hint: { fontSize: 14, lineHeight: 21, fontWeight: '500' },
  readout: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginTop: 4,
  },
  readRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  readLabel: { fontSize: 13, fontWeight: '700' },
  readVal: {
    fontSize: 18,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  factorBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginTop: 4,
  },
  factorTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
  },
  factorGrid: { gap: 6 },
  fRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fLabel: { fontSize: 13, fontWeight: '600' },
  fVal: {
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  barCap: { fontSize: 12, fontWeight: '600', marginTop: 8 },
  barTrack: { width: '100%', marginTop: 4 },
  legend: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
    justifyContent: 'center',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendSwatch: { width: 12, height: 12, borderRadius: 3 },
  legendText: { fontSize: 12, fontWeight: '600' },
});
