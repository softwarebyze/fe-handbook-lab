import { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';

import { ParamSlider } from '@/components/ParamSlider';
import { useAppColors } from '@/hooks/useAppColors';
import { allTvmFactors, fpFactor, pfFactor } from '@/lib/tvmFactors';

export function TvmFactorsSim() {
  const { colors } = useAppColors();
  const [iRate, setIRate] = useState(0.06);
  const [n, setN] = useState(10);
  const [svgW, setSvgW] = useState(320);

  const nInt = Math.round(n);
  const factors = useMemo(() => allTvmFactors(iRate, nInt), [iRate, nInt]);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setSvgW(w);
  };

  const barData = useMemo(() => {
    const maxN = Math.min(nInt, 30);
    const pts: { year: number; fv: number; pv: number }[] = [];
    for (let yr = 0; yr <= maxN; yr++) {
      pts.push({
        year: yr,
        fv: fpFactor(iRate, yr),
        pv: pfFactor(iRate, yr),
      });
    }
    return pts;
  }, [iRate, nInt]);

  const maxFV = barData[barData.length - 1]?.fv ?? 1;

  const chartH = 150;
  const pl = 36;
  const pr = 10;
  const pt = 14;
  const pb = 24;
  const innerW = svgW - pl - pr;
  const innerH = chartH - pt - pb;
  const barCount = barData.length;
  const barGap = Math.max(1, innerW / barCount * 0.15);
  const barWidth = Math.max(2, (innerW - barGap * barCount) / barCount);

  return (
    <View style={styles.container}>
      <View style={[styles.callout, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.hint, { color: colors.text }]}>
          Six standard TVM factors from the FE handbook. Adjust interest rate i and periods n to see how
          money grows or shrinks with time.
        </Text>
      </View>

      <ParamSlider
        label="Interest rate i"
        value={iRate}
        min={0.005}
        max={0.2}
        onChange={setIRate}
        format={(v) => `${(v * 100).toFixed(1)}%`}
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

      <View style={[styles.table, { borderColor: colors.border }]}>
        {factors.map((row) => (
          <View key={row.notation} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
            <View style={styles.tableLeft}>
              <Text style={[styles.notation, { color: colors.tint }]}>{row.notation}</Text>
              <Text style={[styles.factorName, { color: colors.textSecondary }]}>{row.label}</Text>
            </View>
            <Text style={[styles.factorVal, { color: colors.text }]}>
              {row.value < 100 ? row.value.toFixed(4) : row.value.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      <Text style={[styles.chartLabel, { color: colors.textSecondary }]}>
        $1 compound growth (F/P) vs present worth (P/F) per year
      </Text>
      <View style={styles.chartWrap} onLayout={onLayout}>
        <Svg width={svgW} height={chartH}>
          <Rect
            x={0} y={0} width={svgW} height={chartH}
            fill={colors.chartFill} stroke={colors.border} strokeWidth={1} rx={12}
          />
          {/* Y-axis baseline */}
          <Line x1={pl} y1={pt} x2={pl} y2={chartH - pb} stroke={colors.chartGrid} strokeWidth={1} />
          <Line x1={pl} y1={chartH - pb} x2={svgW - pr} y2={chartH - pb} stroke={colors.chartGrid} strokeWidth={1} />
          {/* Y-axis labels */}
          <SvgText x={pl - 4} y={pt + 4} fontSize="9" fill={colors.textMuted} textAnchor="end">
            {maxFV.toFixed(1)}
          </SvgText>
          <SvgText x={pl - 4} y={chartH - pb + 4} fontSize="9" fill={colors.textMuted} textAnchor="end">
            0
          </SvgText>
          {barData.map((pt2, idx) => {
            const x = pl + idx * (barWidth + barGap);
            const fvH = (pt2.fv / maxFV) * innerH;
            const pvH = (pt2.pv / maxFV) * innerH;
            return (
              <View key={pt2.year}>
                <Rect
                  x={x}
                  y={chartH - pb - fvH}
                  width={barWidth / 2}
                  height={Math.max(1, fvH)}
                  fill={colors.tint}
                  opacity={0.7}
                  rx={1}
                />
                <Rect
                  x={x + barWidth / 2}
                  y={chartH - pb - pvH}
                  width={barWidth / 2}
                  height={Math.max(1, pvH)}
                  fill={colors.warning}
                  opacity={0.7}
                  rx={1}
                />
              </View>
            );
          })}
          <SvgText x={pl + 4} y={chartH - 6} fontSize="9" fill={colors.textMuted}>yr 0</SvgText>
          <SvgText x={svgW - pr - 20} y={chartH - 6} fontSize="9" fill={colors.textMuted}>yr {nInt}</SvgText>
        </Svg>
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSwatch, { backgroundColor: colors.tint }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>F/P (growth)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSwatch, { backgroundColor: colors.warning }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>P/F (discount)</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  callout: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 4 },
  hint: { fontSize: 14, lineHeight: 21, fontWeight: '500' },
  table: { borderWidth: 1, borderRadius: 12, overflow: 'hidden', marginTop: 4 },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
  },
  tableLeft: { flex: 1, marginRight: 12 },
  notation: { fontSize: 14, fontWeight: '800', marginBottom: 2 },
  factorName: { fontSize: 12, fontWeight: '500' },
  factorVal: { fontSize: 16, fontWeight: '800', fontVariant: ['tabular-nums'] },
  chartLabel: { fontSize: 12, fontWeight: '600', marginTop: 10 },
  chartWrap: { width: '100%', marginTop: 4 },
  legend: { flexDirection: 'row', gap: 20, marginTop: 4, paddingHorizontal: 4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendSwatch: { width: 12, height: 12, borderRadius: 3 },
  legendText: { fontSize: 11, fontWeight: '600' },
});
