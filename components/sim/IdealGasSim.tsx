import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';

import { ParamSlider } from '@/components/ParamSlider';
import { useAppColors } from '@/hooks/useAppColors';

const R_U = 8314; // J/(kmol·K)

export function IdealGasSim() {
  const { colors } = useAppColors();
  const [n, setN] = useState(1);
  const [T, setT] = useState(300);
  const [V, setV] = useState(2);
  const [boxW, setBoxW] = useState(280);

  const P_Pa = (n * R_U * T) / V;
  const P_kPa = P_Pa / 1000;
  const P_atm = P_Pa / 101325;

  const onBarLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setBoxW(w);
  };

  const svgH = 160;
  const maxContainerW = boxW - 40;
  const containerW = 40 + (V / 10) * (maxContainerW - 40);
  const containerH = 100;
  const containerX = (boxW - containerW) / 2;
  const containerY = (svgH - containerH) / 2;

  const pBar = Math.min(1, P_kPa / 5000);
  const barInnerW = Math.max(0, (boxW - 4) * pBar);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.callout,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}>
        <Text style={[styles.hint, { color: colors.text }]}>
          PV = nR{'\u1D64'}T for an ideal gas. Adjust moles, temperature, and volume to see how
          pressure responds. R{'\u1D64'} = 8314 J/(kmol·K).
        </Text>
      </View>

      <ParamSlider
        label="Moles n (kmol)"
        value={n}
        min={0.1}
        max={5}
        onChange={setN}
        format={(v) => `${v.toFixed(2)} kmol`}
      />
      <ParamSlider
        label="Temperature T (K)"
        value={T}
        min={100}
        max={800}
        onChange={setT}
        format={(v) => `${v.toFixed(0)} K`}
      />
      <ParamSlider
        label="Volume V (m³)"
        value={V}
        min={0.1}
        max={10}
        onChange={setV}
        format={(v) => `${v.toFixed(2)} m³`}
      />

      <View
        style={[
          styles.readout,
          { borderColor: colors.border, backgroundColor: colors.surface },
        ]}>
        <Text style={[styles.pLabel, { color: colors.textMuted }]}>
          Pressure P
        </Text>
        <Text style={[styles.pMain, { color: colors.tint }]}>
          {P_kPa.toFixed(1)} kPa
        </Text>
        <Text style={[styles.pSub, { color: colors.textSecondary }]}>
          ≈ {P_atm.toFixed(3)} atm
        </Text>
      </View>

      <Text style={[styles.barCap, { color: colors.textSecondary }]}>
        Relative pressure (caps at 5 MPa)
      </Text>
      <View style={styles.barTrack} onLayout={onBarLayout}>
        <Svg width={boxW} height={22}>
          <Rect
            x={0}
            y={0}
            width={boxW}
            height={22}
            rx={8}
            fill={colors.chartFill}
            stroke={colors.border}
          />
          <Rect
            x={2}
            y={2}
            width={barInnerW}
            height={18}
            rx={6}
            fill={colors.tint}
          />
        </Svg>
      </View>

      <Text style={[styles.barCap, { color: colors.textSecondary }]}>
        Volume container (wider = larger V)
      </Text>
      <Svg width={boxW} height={svgH}>
        <Rect
          x={0}
          y={0}
          width={boxW}
          height={svgH}
          fill={colors.chartFill}
          stroke={colors.border}
          rx={12}
        />
        <Rect
          x={containerX}
          y={containerY}
          width={containerW}
          height={containerH}
          fill="none"
          stroke={colors.borderStrong}
          strokeWidth={2.5}
          rx={4}
        />
        <Rect
          x={containerX + 2}
          y={containerY + 2}
          width={containerW - 4}
          height={containerH - 4}
          fill={colors.heroOverlay}
          rx={3}
          opacity={Math.min(1, 0.2 + pBar * 0.8)}
        />
        {[0.25, 0.5, 0.75].map((frac) => {
          const tickX = containerX + containerW * frac;
          return (
            <Line
              key={frac}
              x1={tickX}
              y1={containerY + containerH - 6}
              x2={tickX}
              y2={containerY + containerH}
              stroke={colors.textMuted}
              strokeWidth={1}
            />
          );
        })}
        <SvgText
          x={boxW / 2}
          y={containerY + containerH / 2 + 5}
          fill={colors.text}
          fontSize="14"
          fontWeight="700"
          textAnchor="middle">
          {V.toFixed(2)} m³
        </SvgText>
        <SvgText
          x={boxW / 2}
          y={containerY - 8}
          fill={colors.tint}
          fontSize="12"
          fontWeight="700"
          textAnchor="middle">
          P = {P_kPa.toFixed(1)} kPa
        </SvgText>
      </Svg>
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
    padding: 16,
    marginTop: 4,
    alignItems: 'center',
  },
  pLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  pMain: { fontSize: 22, fontWeight: '900', fontVariant: ['tabular-nums'] },
  pSub: { fontSize: 13, marginTop: 6, fontWeight: '600' },
  barCap: { fontSize: 12, fontWeight: '600', marginTop: 8 },
  barTrack: { width: '100%', marginTop: 4 },
});
