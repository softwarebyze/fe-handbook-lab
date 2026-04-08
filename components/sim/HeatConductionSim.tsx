import { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Polyline, Rect, Text as SvgText } from 'react-native-svg';

import { ParamSlider } from '@/components/ParamSlider';
import { useAppColors } from '@/hooks/useAppColors';

export function HeatConductionSim() {
  const { colors } = useAppColors();

  const [k, setK] = useState(1.0);
  const [L, setL] = useState(0.1);
  const [T1, setT1] = useState(100);
  const [T2, setT2] = useState(25);
  const [boxW, setBoxW] = useState(320);

  const dT = T1 - T2;
  const qFlux = k * dT / Math.max(L, 1e-9);
  const R_per_A = L / Math.max(k, 1e-9);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setBoxW(w);
  };

  const svgH = 200;
  const pl = 54;
  const pr = 54;
  const pt = 28;
  const pb = 28;
  const plotW = boxW - pl - pr;
  const plotH = svgH - pt - pb;

  const tMin = Math.min(T1, T2) - 10;
  const tMax = Math.max(T1, T2) + 10;
  const tRange = Math.max(tMax - tMin, 1);

  const profilePoints = useMemo(() => {
    const N = 40;
    const pts: string[] = [];
    for (let i = 0; i <= N; i++) {
      const frac = i / N;
      const T = T1 + (T2 - T1) * frac;
      const x = pl + frac * plotW;
      const y = pt + plotH * (1 - (T - tMin) / tRange);
      pts.push(`${x},${y}`);
    }
    return pts.join(' ');
  }, [T1, T2, tMin, tRange, pl, plotW, pt, plotH]);

  const hotColor = '#ef4444';
  const coldColor = '#3b82f6';

  return (
    <View style={styles.container}>
      <View style={[styles.callout, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.hint, { color: colors.text }]}>
          Steady 1-D conduction through a plane wall: q″ = k·ΔT/L. The temperature profile is linear
          for constant k — adjust parameters to build Fourier's law intuition.
        </Text>
      </View>

      <ParamSlider
        label="Conductivity k (W/(m·K))"
        value={k}
        min={0.02}
        max={400}
        onChange={setK}
        format={(v) => v < 1 ? v.toFixed(3) : v.toFixed(1)}
      />
      <ParamSlider
        label="Wall thickness L (m)"
        value={L}
        min={0.005}
        max={0.5}
        onChange={setL}
        format={(v) => `${(v * 100).toFixed(1)} cm`}
      />
      <ParamSlider
        label="Hot side T₁ (°C)"
        value={T1}
        min={0}
        max={500}
        onChange={setT1}
        format={(v) => `${v.toFixed(0)} °C`}
      />
      <ParamSlider
        label="Cold side T₂ (°C)"
        value={T2}
        min={-40}
        max={200}
        onChange={setT2}
        format={(v) => `${v.toFixed(0)} °C`}
      />

      <View style={[styles.readout, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>Heat flux q″</Text>
          <Text style={[styles.readVal, { color: colors.tint }]}>
            {qFlux < 1e4 ? qFlux.toFixed(1) : qFlux.toExponential(2)} W/m²
          </Text>
        </View>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>ΔT</Text>
          <Text style={[styles.readVal, { color: colors.warning }]}>{dT.toFixed(1)} °C</Text>
        </View>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>R/A = L/k</Text>
          <Text style={[styles.readVal, { color: colors.textSecondary }]}>{R_per_A.toFixed(4)} m²·K/W</Text>
        </View>
      </View>

      <Text style={[styles.chartLabel, { color: colors.textSecondary }]}>Temperature profile through wall</Text>
      <View style={styles.svgWrap} onLayout={onLayout}>
        <Svg width={boxW} height={svgH}>
          <Rect x={0} y={0} width={boxW} height={svgH} fill={colors.chartFill} stroke={colors.border} strokeWidth={1} rx={12} />
          {/* Hot side stripe */}
          <Rect x={pl - 16} y={pt} width={16} height={plotH} fill={hotColor} opacity={0.15} />
          {/* Cold side stripe */}
          <Rect x={pl + plotW} y={pt} width={16} height={plotH} fill={coldColor} opacity={0.15} />
          {/* Wall boundaries */}
          <Line x1={pl} y1={pt} x2={pl} y2={pt + plotH} stroke={hotColor} strokeWidth={1.5} strokeDasharray="4 3" />
          <Line x1={pl + plotW} y1={pt} x2={pl + plotW} y2={pt + plotH} stroke={coldColor} strokeWidth={1.5} strokeDasharray="4 3" />
          {/* Temperature profile */}
          <Polyline points={profilePoints} fill="none" stroke={colors.tint} strokeWidth={3} strokeLinecap="round" />
          {/* Labels */}
          <SvgText x={pl} y={pt - 8} fill={hotColor} fontSize="12" fontWeight="700" textAnchor="middle">
            T₁
          </SvgText>
          <SvgText x={pl + plotW} y={pt - 8} fill={coldColor} fontSize="12" fontWeight="700" textAnchor="middle">
            T₂
          </SvgText>
          <SvgText x={pl + plotW / 2} y={svgH - 6} fill={colors.textMuted} fontSize="11" fontWeight="600" textAnchor="middle">
            x → (0 to L)
          </SvgText>
          {/* Y-axis hints */}
          <SvgText x={pl - 22} y={pt + 4} fill={colors.textMuted} fontSize="10" fontWeight="600" textAnchor="end">
            {tMax.toFixed(0)}°
          </SvgText>
          <SvgText x={pl - 22} y={pt + plotH + 4} fill={colors.textMuted} fontSize="10" fontWeight="600" textAnchor="end">
            {tMin.toFixed(0)}°
          </SvgText>
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  callout: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 4 },
  hint: { fontSize: 14, lineHeight: 21, fontWeight: '500' },
  readout: { borderRadius: 14, borderWidth: 1, padding: 14, marginTop: 4 },
  readRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  readLabel: { fontSize: 13, fontWeight: '700' },
  readVal: { fontSize: 18, fontWeight: '800', fontVariant: ['tabular-nums'] },
  chartLabel: { fontSize: 12, fontWeight: '600', marginTop: 10, letterSpacing: 0.2 },
  svgWrap: { width: '100%', marginTop: 4 },
});
