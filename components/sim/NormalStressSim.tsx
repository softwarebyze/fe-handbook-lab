import { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Rect, Polygon, Text as SvgText } from 'react-native-svg';

import { ParamSlider } from '@/components/ParamSlider';
import { useAppColors } from '@/hooks/useAppColors';

const BAR_NOMINAL_LEN = 0.7;

export function NormalStressSim() {
  const { colors } = useAppColors();

  const [force, setForce] = useState(50); // kN
  const [area, setArea] = useState(500); // mm²
  const [length, setLength] = useState(2); // m
  const [modulus, setModulus] = useState(200); // GPa (steel default)
  const [boxW, setBoxW] = useState(320);

  const F_N = force * 1e3;
  const A_m2 = area * 1e-6;
  const E_Pa = modulus * 1e9;

  const sigma = F_N / A_m2; // Pa
  const sigma_MPa = sigma / 1e6;
  const epsilon = sigma / E_Pa;
  const delta_m = (F_N * length) / (A_m2 * E_Pa);
  const delta_mm = delta_m * 1e3;

  const stressRatio = useMemo(() => Math.min(1, sigma_MPa / 500), [sigma_MPa]);
  const strainRatio = useMemo(() => Math.min(1, epsilon / 0.003), [epsilon]);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setBoxW(w);
  };

  const h = 160;
  const margin = 32;
  const barY = 40;
  const barH = 36;
  const nominalW = (boxW - margin * 2) * BAR_NOMINAL_LEN;
  const extensionFrac = Math.min(delta_m / length, 0.15);
  const barW = nominalW * (1 + extensionFrac * 3);
  const areaScale = Math.sqrt(area / 500);
  const scaledBarH = Math.max(16, Math.min(60, barH * areaScale));
  const barTopY = barY + (barH - scaledBarH) / 2;
  const arrowLen = Math.min(60, 20 + stressRatio * 40);

  return (
    <View style={styles.container}>
      <View style={[styles.callout, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.hint, { color: colors.text }]}>
          Axial bar under tension: σ = F/A, ε = σ/E, δ = FL/(AE). Adjust force, area, length, and
          modulus to see how stress, strain, and elongation respond.
        </Text>
      </View>

      <ParamSlider
        label="Force F (kN)"
        value={force}
        min={1}
        max={200}
        onChange={setForce}
        format={(v) => `${v.toFixed(1)} kN`}
      />
      <ParamSlider
        label="Area A (mm²)"
        value={area}
        min={50}
        max={2000}
        onChange={setArea}
        format={(v) => `${v.toFixed(0)} mm²`}
      />
      <ParamSlider
        label="Length L (m)"
        value={length}
        min={0.5}
        max={5}
        onChange={setLength}
        format={(v) => `${v.toFixed(2)} m`}
      />
      <ParamSlider
        label="Modulus E (GPa)"
        value={modulus}
        min={10}
        max={400}
        onChange={setModulus}
        format={(v) => `${v.toFixed(0)} GPa`}
      />

      <View style={[styles.readout, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>Stress σ</Text>
          <Text style={[styles.readVal, { color: colors.tint }]}>{sigma_MPa.toFixed(1)} MPa</Text>
        </View>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>Strain ε</Text>
          <Text style={[styles.readVal, { color: colors.warning }]}>{epsilon.toExponential(3)}</Text>
        </View>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>Elongation δ</Text>
          <Text style={[styles.readVal, { color: colors.success }]}>{delta_mm.toFixed(3)} mm</Text>
        </View>
      </View>

      <View style={styles.svgWrap} onLayout={onLayout}>
        <Svg width={boxW} height={h}>
          <Rect
            x={0}
            y={0}
            width={boxW}
            height={h}
            fill={colors.chartFill}
            stroke={colors.border}
            strokeWidth={1}
            rx={12}
          />

          {/* Wall / support */}
          <Line
            x1={margin}
            y1={barY - 8}
            x2={margin}
            y2={barY + barH + 8}
            stroke={colors.textMuted}
            strokeWidth={4}
            strokeLinecap="round"
          />

          {/* Bar */}
          <Rect
            x={margin}
            y={barTopY}
            width={barW}
            height={scaledBarH}
            rx={4}
            fill={colors.tint}
            opacity={0.25 + stressRatio * 0.55}
          />
          <Rect
            x={margin}
            y={barTopY}
            width={barW}
            height={scaledBarH}
            rx={4}
            fill="none"
            stroke={colors.tint}
            strokeWidth={2}
          />

          {/* Force arrow */}
          <Line
            x1={margin + barW + 4}
            y1={barY + barH / 2}
            x2={margin + barW + 4 + arrowLen}
            y2={barY + barH / 2}
            stroke={colors.danger}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <Polygon
            points={`${margin + barW + 4 + arrowLen},${barY + barH / 2} ${margin + barW + arrowLen - 6},${barY + barH / 2 - 7} ${margin + barW + arrowLen - 6},${barY + barH / 2 + 7}`}
            fill={colors.danger}
          />
          <SvgText
            x={margin + barW + arrowLen / 2}
            y={barY + barH / 2 - 12}
            fill={colors.text}
            fontSize="12"
            fontWeight="600"
            textAnchor="middle"
          >
            F
          </SvgText>

          {/* Length annotation */}
          <Line
            x1={margin}
            y1={barTopY + scaledBarH + 16}
            x2={margin + barW}
            y2={barTopY + scaledBarH + 16}
            stroke={colors.textMuted}
            strokeWidth={1}
            strokeDasharray="4 3"
          />
          <SvgText
            x={margin + barW / 2}
            y={barTopY + scaledBarH + 30}
            fill={colors.textSecondary}
            fontSize="11"
            fontWeight="600"
            textAnchor="middle"
          >
            L + δ
          </SvgText>
        </Svg>
      </View>

      <View style={styles.barRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.barCaption, { color: colors.textSecondary }]}>
            Stress (capped at 500 MPa)
          </Text>
          <View style={[styles.barTrack, { backgroundColor: colors.chartFill, borderColor: colors.border }]}>
            <View
              style={[
                styles.barFill,
                { width: `${stressRatio * 100}%`, backgroundColor: colors.tint },
              ]}
            />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.barCaption, { color: colors.textSecondary }]}>
            Strain (capped at 0.3%)
          </Text>
          <View style={[styles.barTrack, { backgroundColor: colors.chartFill, borderColor: colors.border }]}>
            <View
              style={[
                styles.barFill,
                { width: `${strainRatio * 100}%`, backgroundColor: colors.warning },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  callout: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 4 },
  hint: { fontSize: 14, lineHeight: 21, fontWeight: '500' },
  readout: { borderRadius: 14, borderWidth: 1, padding: 14, marginTop: 4 },
  readRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  readLabel: { fontSize: 13, fontWeight: '700' },
  readVal: { fontSize: 18, fontWeight: '800', fontVariant: ['tabular-nums'] },
  svgWrap: { width: '100%', marginTop: 4 },
  barRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  barCaption: { fontSize: 11, fontWeight: '600', marginBottom: 4 },
  barTrack: {
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 7 },
});
