import { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Polygon, Rect, Text as SvgText } from 'react-native-svg';

import { ParamSlider } from '@/components/ParamSlider';
import { useAppColors } from '@/hooks/useAppColors';

const YIELD_MILD_STEEL_MPA = 250;

export function NormalStressSim() {
  const { colors } = useAppColors();

  const [force, setForce] = useState(50);
  const [area, setArea] = useState(500);
  const [boxW, setBoxW] = useState(320);

  const forceN = force * 1e3;
  const areaM2 = area * 1e-6;
  const sigma = forceN / areaM2;
  const sigmaMPa = sigma / 1e6;

  const yieldRatio = sigmaMPa / YIELD_MILD_STEEL_MPA;
  const isYielded = yieldRatio >= 1;

  const sideMm = Math.sqrt(area);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setBoxW(w);
  };

  const svgH = 200;
  const barMinW = 24;
  const barMaxW = 110;
  const barVisualW = useMemo(
    () => barMinW + (barMaxW - barMinW) * Math.min(1, area / 2500),
    [area],
  );
  const barH = 80;
  const cx = boxW / 2;
  const cy = svgH / 2;
  const barX = cx - barVisualW / 2;
  const barY = cy - barH / 2;

  const arrowLen = 42;

  const stressColor = isYielded ? colors.danger : colors.tint;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.callout,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}>
        <Text style={[styles.hint, { color: colors.text }]}>
          Average normal stress on a cross-section under axial load: σ = F / A. The bar cross-section
          scales with area. Compare to mild-steel yield ≈ 250 MPa.
        </Text>
      </View>

      <ParamSlider
        label="Axial force F (kN)"
        value={force}
        min={1}
        max={500}
        onChange={setForce}
        format={(v) => `${v.toFixed(1)} kN`}
      />
      <ParamSlider
        label="Cross-section area A (mm²)"
        value={area}
        min={25}
        max={2500}
        onChange={setArea}
        format={(v) => `${v.toFixed(0)} mm²`}
      />

      <View
        style={[
          styles.readout,
          { borderColor: colors.border, backgroundColor: colors.surface },
        ]}>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>Normal stress σ</Text>
          <Text style={[styles.readVal, { color: stressColor }]}>
            {sigmaMPa.toFixed(2)} MPa
          </Text>
        </View>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>
            Equiv. square side
          </Text>
          <Text style={[styles.readVal, { color: colors.textSecondary }]}>
            {sideMm.toFixed(1)} mm
          </Text>
        </View>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>
            σ / σ_y (mild steel)
          </Text>
          <Text
            style={[
              styles.readVal,
              { color: isYielded ? colors.danger : colors.success },
            ]}>
            {(yieldRatio * 100).toFixed(1)}%
            {isYielded ? '  ⚠ yielded' : ''}
          </Text>
        </View>
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

          {/* Bar */}
          <Rect
            x={barX}
            y={barY}
            width={barVisualW}
            height={barH}
            fill={stressColor}
            opacity={0.18}
            stroke={stressColor}
            strokeWidth={2}
            rx={4}
          />

          {/* Left force arrow (pulling left = tension) */}
          <Line
            x1={barX - arrowLen}
            y1={cy}
            x2={barX}
            y2={cy}
            stroke={stressColor}
            strokeWidth={4}
            strokeLinecap="round"
          />
          <Polygon
            points={`${barX - arrowLen},${cy} ${barX - arrowLen + 12},${cy - 7} ${barX - arrowLen + 12},${cy + 7}`}
            fill={stressColor}
          />
          <SvgText
            x={barX - arrowLen - 6}
            y={cy + 5}
            fill={colors.text}
            fontSize="14"
            fontWeight="700"
            textAnchor="end">
            F
          </SvgText>

          {/* Right force arrow (pulling right = tension) */}
          <Line
            x1={barX + barVisualW}
            y1={cy}
            x2={barX + barVisualW + arrowLen}
            y2={cy}
            stroke={stressColor}
            strokeWidth={4}
            strokeLinecap="round"
          />
          <Polygon
            points={`${barX + barVisualW + arrowLen},${cy} ${barX + barVisualW + arrowLen - 12},${cy - 7} ${barX + barVisualW + arrowLen - 12},${cy + 7}`}
            fill={stressColor}
          />
          <SvgText
            x={barX + barVisualW + arrowLen + 8}
            y={cy + 5}
            fill={colors.text}
            fontSize="14"
            fontWeight="700"
            textAnchor="start">
            F
          </SvgText>

          {/* Cross-section cut line */}
          <Line
            x1={cx}
            y1={barY - 14}
            x2={cx}
            y2={barY + barH + 14}
            stroke={colors.textMuted}
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
          <SvgText
            x={cx}
            y={barY + barH + 28}
            fill={colors.textSecondary}
            fontSize="11"
            fontWeight="600"
            textAnchor="middle">
            section cut (A)
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
  svgWrap: { width: '100%', marginTop: 8 },
});
