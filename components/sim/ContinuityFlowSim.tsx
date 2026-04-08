import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

import { ParamSlider } from '@/components/ParamSlider';
import { useAppColors } from '@/hooks/useAppColors';

export function ContinuityFlowSim() {
  const { colors } = useAppColors();
  const [area, setArea] = useState(0.4);
  const [speed, setSpeed] = useState(2.5);
  const [barW, setBarW] = useState(280);

  const Q = area * speed;
  const Q_Ls = Q * 1000;

  const qFrac = Math.min(1, Q / 2);

  const onBarLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setBarW(w);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.callout, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.hint, { color: colors.text }]}>
          Steady incompressible model: Q = A·V_avg. Units: m³/s = m² · m/s. Liters per second shown for
          intuition (1 m³/s = 1000 L/s).
        </Text>
      </View>

      <ParamSlider
        label="Area A"
        value={area}
        min={0.05}
        max={2}
        onChange={setArea}
        format={(v) => `${v.toFixed(2)} m²`}
      />
      <ParamSlider
        label="Average speed V"
        value={speed}
        min={0.1}
        max={8}
        onChange={setSpeed}
        format={(v) => `${v.toFixed(2)} m/s`}
      />

      <View style={[styles.readout, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <Text style={[styles.qLabel, { color: colors.textMuted }]}>Volumetric flow Q</Text>
        <Text style={[styles.qMain, { color: colors.tint }]}>{Q.toFixed(4)} m³/s</Text>
        <Text style={[styles.qSub, { color: colors.textSecondary }]}>
          ≈ {Q_Ls.toFixed(2)} L/s (for water thinking)
        </Text>
      </View>

      <Text style={[styles.barCap, { color: colors.textSecondary }]}>Relative Q (caps at 2 m³/s)</Text>
      <View style={styles.barTrack} onLayout={onBarLayout}>
        <Svg width={barW} height={22}>
          <Rect x={0} y={0} width={barW} height={22} rx={8} fill={colors.chartFill} stroke={colors.border} />
          <Rect x={2} y={2} width={Math.max(0, (barW - 4) * qFrac)} height={18} rx={6} fill={colors.tint} />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  callout: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 4 },
  hint: { fontSize: 14, lineHeight: 21, fontWeight: '500' },
  readout: { borderRadius: 14, borderWidth: 1, padding: 16, marginTop: 4, alignItems: 'center' },
  qLabel: { fontSize: 12, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 },
  qMain: { fontSize: 22, fontWeight: '900', fontVariant: ['tabular-nums'] },
  qSub: { fontSize: 13, marginTop: 6, fontWeight: '600' },
  barCap: { fontSize: 12, fontWeight: '600', marginTop: 8 },
  barTrack: { width: '100%', marginTop: 4 },
});
