import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

import { ParamSlider } from '@/components/ParamSlider';
import { useAppColors } from '@/hooks/useAppColors';

export function OhmLawSim() {
  const { colors } = useAppColors();
  const [volts, setVolts] = useState(12);
  const [ohms, setOhms] = useState(8);
  const [barW, setBarW] = useState(280);

  const r = Math.max(ohms, 0.25);
  const I = volts / r;
  const P = volts * I;

  const iFrac = Math.min(1, I / 10);
  const pFrac = Math.min(1, P / 120);

  const onBarLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setBarW(w);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.callout, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.hint, { color: colors.text }]}>
          Ideal DC resistor: I = V/R. Power P = V·I shows up as heat in the component. Bars cap at 10 A and 120 W
          for display only.
        </Text>
      </View>

      <ParamSlider
        label="Voltage V"
        value={volts}
        min={0.5}
        max={24}
        onChange={setVolts}
        format={(v) => `${v.toFixed(1)} V`}
      />
      <ParamSlider
        label="Resistance R"
        value={ohms}
        min={0.5}
        max={40}
        onChange={setOhms}
        format={(v) => `${v.toFixed(2)} Ω`}
      />

      <View style={[styles.readout, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>Current I</Text>
          <Text style={[styles.readVal, { color: colors.tint }]}>{I.toFixed(3)} A</Text>
        </View>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>Power P</Text>
          <Text style={[styles.readVal, { color: colors.warning }]}>{P.toFixed(2)} W</Text>
        </View>
      </View>

      <Text style={[styles.barCap, { color: colors.textSecondary }]}>Relative scale (I and P)</Text>
      <View style={styles.barTrack} onLayout={onBarLayout}>
        <Svg width={barW} height={36}>
          <Rect x={0} y={0} width={barW} height={36} rx={8} fill={colors.chartFill} stroke={colors.border} />
          <Rect x={2} y={2} width={Math.max(0, (barW - 4) * iFrac)} height={14} rx={6} fill={colors.tint} />
          <Rect
            x={2}
            y={18}
            width={Math.max(0, (barW - 4) * pFrac)}
            height={14}
            rx={6}
            fill={colors.warning}
            opacity={0.85}
          />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  callout: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 4 },
  hint: { fontSize: 14, lineHeight: 21, fontWeight: '500' },
  readout: { borderRadius: 14, borderWidth: 1, padding: 14, marginTop: 4 },
  readRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  readLabel: { fontSize: 13, fontWeight: '700' },
  readVal: { fontSize: 18, fontWeight: '800', fontVariant: ['tabular-nums'] },
  barCap: { fontSize: 12, fontWeight: '600', marginTop: 8 },
  barTrack: { width: '100%', marginTop: 4 },
});
