import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Polyline, Rect } from 'react-native-svg';

import { useAppColors } from '@/hooks/useAppColors';

export type SeriesPoint = { t: number; y: number };

type Props = {
  series: SeriesPoint[];
  width: number;
  height: number;
  yLabel?: string;
  yMin?: number;
  yMax?: number;
};

export function TimeSeriesChart({
  series,
  width,
  height,
  yLabel,
  yMin: yMinProp,
  yMax: yMaxProp,
}: Props) {
  const { colors } = useAppColors();
  const pl = 10;
  const pr = 10;
  const pt = 10;
  const pb = 22;
  const innerW = width - pl - pr;
  const innerH = height - pt - pb;

  const { points, yMin, yMax, midY, zeroInView, tMaxVal } = useMemo(() => {
    if (series.length === 0) {
      return {
        points: '',
        yMin: 0,
        yMax: 1,
        midY: height / 2,
        zeroInView: false,
        tMaxVal: 1,
      };
    }
    const dataMin = Math.min(...series.map((p) => p.y));
    const dataMax = Math.max(...series.map((p) => p.y));
    // Merge fixed bounds with actual data so the curve never clips off-scale
    let yLo = yMinProp != null ? Math.min(yMinProp, dataMin) : dataMin;
    let yHi = yMaxProp != null ? Math.max(yMaxProp, dataMax) : dataMax;
    const pad = (yHi - yLo) * 0.06 + 1e-6;
    yLo -= pad;
    yHi += pad;
    if (yHi - yLo < 1e-9) {
      yLo -= 1;
      yHi += 1;
    }
    const tLast = series[series.length - 1]?.t ?? 0;
    const tMax = Math.max(tLast, 1e-9);
    const pts = series
      .map((p) => {
        const x = pl + (p.t / tMax) * innerW;
        const yn = (p.y - yLo) / (yHi - yLo);
        const y = pt + innerH * (1 - yn);
        return `${x},${y}`;
      })
      .join(' ');
    const mid = pt + innerH * (1 - (0 - yLo) / (yHi - yLo));
    const ziv = mid >= pt && mid <= pt + innerH;
    return { points: pts, yMin: yLo, yMax: yHi, midY: mid, zeroInView: ziv, tMaxVal: tLast };
  }, [series, yMinProp, yMaxProp, innerW, innerH, pl, pt, height]);

  const gridLines = [0.25, 0.5, 0.75].map((g) => {
    const y = pt + innerH * (1 - g);
    return (
      <Line
        key={g}
        x1={pl}
        y1={y}
        x2={width - pr}
        y2={y}
        stroke={colors.chartGrid}
        strokeWidth={1}
        opacity={0.6}
      />
    );
  });

  return (
    <View style={{ width }}>
      {yLabel ? (
        <Text style={[styles.caption, { color: colors.textSecondary }]}>{yLabel}</Text>
      ) : null}
      <Svg width={width} height={height}>
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={colors.chartFill}
          stroke={colors.border}
          strokeWidth={1}
          rx={12}
        />
        {gridLines}
        {zeroInView ? (
          <Line
            x1={pl}
            y1={midY}
            x2={width - pr}
            y2={midY}
            stroke={colors.chartZeroLine}
            strokeDasharray="5 5"
            strokeWidth={1.5}
          />
        ) : null}
        {series.length > 1 ? (
          <Polyline
            points={points}
            fill="none"
            stroke={colors.tint}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}
      </Svg>
      {series.length > 1 ? (
        <Text style={[styles.axisHint, { color: colors.textMuted }]}>
          t → {tMaxVal.toFixed(2)}s · y [{yMin.toFixed(3)}, {yMax.toFixed(3)}]
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  caption: { fontSize: 12, fontWeight: '600', marginBottom: 6, letterSpacing: 0.2 },
  axisHint: {
    fontSize: 10,
    marginTop: 4,
    fontVariant: ['tabular-nums'],
    alignSelf: 'flex-end',
  },
});
