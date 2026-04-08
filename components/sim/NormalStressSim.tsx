import { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, {
  Line,
  Polygon,
  Rect,
  Text as SvgText,
} from 'react-native-svg';

import { ParamSlider } from '@/components/ParamSlider';
import { useAppColors } from '@/hooks/useAppColors';

const YIELD_STEEL_MPA = 250;

export function NormalStressSim() {
  const { colors } = useAppColors();

  const [forceKN, setForceKN] = useState(50);
  const [areaCm2, setAreaCm2] = useState(10);
  const [boxW, setBoxW] = useState(300);

  const F_N = forceKN * 1000;
  const A_m2 = areaCm2 * 1e-4;
  const sigma_Pa = A_m2 > 0 ? F_N / A_m2 : 0;
  const sigma_MPa = sigma_Pa / 1e6;

  const yieldRatio = sigma_MPa / YIELD_STEEL_MPA;
  const nearYield = yieldRatio > 0.8;
  const overYield = yieldRatio > 1;

  const stressColor = overYield
    ? colors.danger
    : nearYield
      ? colors.warning
      : colors.tint;

  const barFrac = useMemo(
    () => Math.min(1, sigma_MPa / (YIELD_STEEL_MPA * 1.3)),
    [sigma_MPa],
  );

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setBoxW(w);
  };

  const svgH = 170;
  const barLeft = 60;
  const barRight = boxW - 60;
  const barW = barRight - barLeft;
  const barH = Math.max(20, Math.min(70, areaCm2 * 3.5));
  const barTop = (svgH - barH) / 2;
  const arrowLen = 28;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.callout,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}>
        <Text style={[styles.hint, { color: colors.text }]}>
          Average normal stress on a cross-section: σ = F / A. Tension stretches;
          the bar area scales visually. A mild-steel yield reference ({YIELD_STEEL_MPA} MPa)
          turns the readout amber then red.
        </Text>
      </View>

      <ParamSlider
        label="Axial force F"
        value={forceKN}
        min={1}
        max={200}
        onChange={setForceKN}
        format={(v) => `${v.toFixed(1)} kN`}
      />
      <ParamSlider
        label="Cross-section area A"
        value={areaCm2}
        min={1}
        max={20}
        onChange={setAreaCm2}
        format={(v) => `${v.toFixed(1)} cm²`}
      />

      <View style={[styles.readout, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>
            Normal stress σ
          </Text>
          <Text style={[styles.readVal, { color: stressColor }]}>
            {sigma_MPa.toFixed(1)} MPa
          </Text>
        </View>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>
            Yield ratio (mild steel)
          </Text>
          <Text
            style={[
              styles.readVal,
              { color: stressColor, fontSize: 15 },
            ]}>
            {(yieldRatio * 100).toFixed(0)}%
          </Text>
        </View>
      </View>

      <Text style={[styles.barCap, { color: colors.textSecondary }]}>
        Stress relative to 1.3 × yield
      </Text>
      <View style={styles.barTrack} onLayout={onLayout}>
        <Svg width={boxW} height={24}>
          <Rect x={0} y={0} width={boxW} height={24} rx={8} fill={colors.chartFill} stroke={colors.border} />
          {/* yield marker */}
          <Line
            x1={(boxW - 4) * (1 / 1.3) + 2}
            y1={2}
            x2={(boxW - 4) * (1 / 1.3) + 2}
            y2={22}
            stroke={colors.warning}
            strokeWidth={2}
            strokeDasharray="4 3"
          />
          <Rect
            x={2}
            y={2}
            width={Math.max(0, (boxW - 4) * barFrac)}
            height={20}
            rx={6}
            fill={stressColor}
            opacity={0.85}
          />
        </Svg>
      </View>

      <View style={styles.svgWrap} onLayout={onLayout}>
        <Svg width={boxW} height={svgH}>
          <Rect
            x={0}
            y={0}
            width={boxW}
            height={svgH}
            fill={colors.chartFill}
            stroke={colors.border}
            strokeWidth={1}
            rx={12}
          />
          {/* Bar member */}
          <Rect
            x={barLeft}
            y={barTop}
            width={barW}
            height={barH}
            rx={4}
            fill={stressColor}
            opacity={0.18}
            stroke={stressColor}
            strokeWidth={2}
          />
          {/* Left arrow (pull left) */}
          <Line
            x1={barLeft - 4}
            y1={svgH / 2}
            x2={barLeft - 4 - arrowLen}
            y2={svgH / 2}
            stroke={stressColor}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <Polygon
            points={`${barLeft - 4 - arrowLen - 8},${svgH / 2} ${barLeft - 4 - arrowLen + 6},${svgH / 2 - 7} ${barLeft - 4 - arrowLen + 6},${svgH / 2 + 7}`}
            fill={stressColor}
          />
          {/* Right arrow (pull right) */}
          <Line
            x1={barRight + 4}
            y1={svgH / 2}
            x2={barRight + 4 + arrowLen}
            y2={svgH / 2}
            stroke={stressColor}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <Polygon
            points={`${barRight + 4 + arrowLen + 8},${svgH / 2} ${barRight + 4 + arrowLen - 6},${svgH / 2 - 7} ${barRight + 4 + arrowLen - 6},${svgH / 2 + 7}`}
            fill={stressColor}
          />
          {/* Labels */}
          <SvgText
            x={barLeft - arrowLen - 16}
            y={svgH / 2 - 14}
            fill={colors.text}
            fontSize="13"
            fontWeight="600"
            textAnchor="middle">
            F
          </SvgText>
          <SvgText
            x={barRight + arrowLen + 16}
            y={svgH / 2 - 14}
            fill={colors.text}
            fontSize="13"
            fontWeight="600"
            textAnchor="middle">
            F
          </SvgText>
          {/* Area label centered on bar */}
          <SvgText
            x={barLeft + barW / 2}
            y={barTop + barH / 2 + 5}
            fill={colors.text}
            fontSize="13"
            fontWeight="700"
            textAnchor="middle">
            A = {areaCm2.toFixed(1)} cm²
          </SvgText>
          {/* Stress label below bar */}
          <SvgText
            x={barLeft + barW / 2}
            y={barTop + barH + 22}
            fill={stressColor}
            fontSize="14"
            fontWeight="800"
            textAnchor="middle">
            σ = {sigma_MPa.toFixed(1)} MPa
          </SvgText>
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
  readRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  readLabel: { fontSize: 13, fontWeight: '700' },
  readVal: { fontSize: 18, fontWeight: '800', fontVariant: ['tabular-nums'] },
  barCap: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  barTrack: { width: '100%', marginTop: 4 },
  svgWrap: { width: '100%', marginTop: 8 },
});
