import { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

import { ParamSlider } from '@/components/ParamSlider';
import { useAppColors } from '@/hooks/useAppColors';

const R_U = 8.314; // kJ/(kmol·K) — universal gas constant

type SolveFor = 'P' | 'V' | 'T';

export function IdealGasSim() {
  const { colors } = useAppColors();

  const [solveFor, setSolveFor] = useState<SolveFor>('P');
  const [pressure, setPressure] = useState(101.325); // kPa
  const [volume, setVolume] = useState(1.0); // m³
  const [moles, setMoles] = useState(0.05); // kmol
  const [temperature, setTemperature] = useState(293); // K
  const [barW, setBarW] = useState(280);

  const computed = useMemo(() => {
    switch (solveFor) {
      case 'P': {
        const P = (moles * R_U * temperature) / Math.max(volume, 1e-6);
        return { P, V: volume, n: moles, T: temperature };
      }
      case 'V': {
        const V = (moles * R_U * temperature) / Math.max(pressure, 1e-6);
        return { P: pressure, V, n: moles, T: temperature };
      }
      case 'T': {
        const T = (pressure * volume) / Math.max(moles * R_U, 1e-12);
        return { P: pressure, V: volume, n: moles, T };
      }
    }
  }, [solveFor, pressure, volume, moles, temperature]);

  const pFrac = Math.min(1, computed.P / 1000);
  const vFrac = Math.min(1, computed.V / 10);

  const onBarLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setBarW(w);
  };

  const modes: { key: SolveFor; label: string }[] = [
    { key: 'P', label: 'Solve P' },
    { key: 'V', label: 'Solve V' },
    { key: 'T', label: 'Solve T' },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.callout, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.hint, { color: colors.text }]}>
          PV = nR{"ᵤ"}T for an ideal gas. Pick which variable to solve for, then sweep the others and
          watch the result update.
        </Text>
      </View>

      <View style={styles.modeRow}>
        {modes.map((m) => (
          <Text
            key={m.key}
            onPress={() => setSolveFor(m.key)}
            style={[
              styles.modeBtn,
              {
                backgroundColor: solveFor === m.key ? colors.tint : colors.surface,
                color: solveFor === m.key ? '#fff' : colors.text,
                borderColor: solveFor === m.key ? colors.tint : colors.border,
              },
            ]}>
            {m.label}
          </Text>
        ))}
      </View>

      {solveFor !== 'P' && (
        <ParamSlider
          label="Pressure P (kPa)"
          value={pressure}
          min={10}
          max={1000}
          onChange={setPressure}
          format={(v) => `${v.toFixed(1)} kPa`}
        />
      )}
      {solveFor !== 'V' && (
        <ParamSlider
          label="Volume V (m\u00B3)"
          value={volume}
          min={0.01}
          max={10}
          onChange={setVolume}
          format={(v) => `${v.toFixed(3)} m\u00B3`}
        />
      )}
      <ParamSlider
        label="Moles n (kmol)"
        value={moles}
        min={0.001}
        max={0.5}
        onChange={setMoles}
        format={(v) => `${v.toFixed(4)} kmol`}
      />
      {solveFor !== 'T' && (
        <ParamSlider
          label="Temperature T (K)"
          value={temperature}
          min={100}
          max={800}
          onChange={setTemperature}
          format={(v) => `${v.toFixed(0)} K`}
        />
      )}

      <View style={[styles.readout, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>P</Text>
          <Text
            style={[
              styles.readVal,
              { color: solveFor === 'P' ? colors.tint : colors.text },
              solveFor === 'P' && styles.readSolved,
            ]}>
            {computed.P.toFixed(2)} kPa
          </Text>
        </View>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>V</Text>
          <Text
            style={[
              styles.readVal,
              { color: solveFor === 'V' ? colors.tint : colors.text },
              solveFor === 'V' && styles.readSolved,
            ]}>
            {computed.V.toFixed(4)} m{'\u00B3'}
          </Text>
        </View>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>n</Text>
          <Text style={[styles.readVal, { color: colors.text }]}>{computed.n.toFixed(4)} kmol</Text>
        </View>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>T</Text>
          <Text
            style={[
              styles.readVal,
              { color: solveFor === 'T' ? colors.tint : colors.text },
              solveFor === 'T' && styles.readSolved,
            ]}>
            {computed.T.toFixed(1)} K
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>R{"ᵤ"}</Text>
          <Text style={[styles.readVal, { color: colors.textSecondary }]}>8.314 kJ/(kmol{'\u00B7'}K)</Text>
        </View>
      </View>

      <Text style={[styles.barCap, { color: colors.textSecondary }]}>
        Relative scale: P (0{'\u2013'}1000 kPa) and V (0{'\u2013'}10 m{'\u00B3'})
      </Text>
      <View style={styles.barTrack} onLayout={onBarLayout}>
        <Svg width={barW} height={36}>
          <Rect x={0} y={0} width={barW} height={36} rx={8} fill={colors.chartFill} stroke={colors.border} />
          <Rect x={2} y={2} width={Math.max(0, (barW - 4) * pFrac)} height={14} rx={6} fill={colors.tint} />
          <Rect
            x={2}
            y={18}
            width={Math.max(0, (barW - 4) * vFrac)}
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
  container: { gap: 6 },
  callout: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 4 },
  hint: { fontSize: 14, lineHeight: 21, fontWeight: '500' },
  modeRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 6,
  },
  modeBtn: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '800',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  readout: { borderRadius: 14, borderWidth: 1, padding: 14, marginTop: 4 },
  readRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  readLabel: { fontSize: 14, fontWeight: '800' },
  readVal: { fontSize: 16, fontWeight: '700', fontVariant: ['tabular-nums'] },
  readSolved: { fontWeight: '900', fontSize: 18 },
  divider: { height: 1, marginVertical: 4 },
  barCap: { fontSize: 12, fontWeight: '600', marginTop: 8 },
  barTrack: { width: '100%', marginTop: 4 },
});
