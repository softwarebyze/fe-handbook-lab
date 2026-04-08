import { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Rect, Text as SvgText, Polygon } from 'react-native-svg';

import { ParamSlider } from '@/components/ParamSlider';
import { useAppColors } from '@/hooks/useAppColors';

const BAR_Y = 60;
const BAR_H = 60;

export function NormalStressSim() {
  const { colors } = useAppColors();
  const [force, setForce] = useState(50);
  const [area, setArea] = useState(0.005);
  const [boxW, setBoxW] = useState(320);

  const sigma = force / Math.max(area, 1e-9);
  const sigMPa = sigma / 1e6;

  const areaBarFrac = useMemo(() => Math.min(1, area / 0.02), [area]);
  const stressFrac = useMemo(() => Math.min(1, Math.abs(sigMPa) / 200), [sigMPa]);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setBoxW(w);
  };

  const svgH = 180;
  const barLeft = 60;
  const barRight = boxW - 40;
  const barLen = Math.max(20, barRight - barLeft);
  const barThick = 12 + areaBarFrac * 40;
  const barMidY = BAR_Y + BAR_H / 2;
  const arrowLen = Math.min(40, force * 0.4 + 10);

  const stressLabel =
    force >= 0 ? `${sigMPa.toFixed(2)} MPa (tension)` : `${Math.abs(sigMPa).toFixed(2)} MPa (compression)`;

  return (
    <View style={styles.container}>
      <View style={[styles.callout, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.hint, { color: colors.text }]}>
          Average normal stress on an axial member: σ = F/A. Doubling area halves stress for the same
          load — a core sizing concept in mechanics of materials.
        </Text>
      </View>

      <ParamSlider
        label="Axial force F (kN)"
        value={force}
        min={1}
        max={200}
        onChange={setForce}
        format={(v) => `${v.toFixed(1)} kN`}
      />
      <ParamSlider
        label="Area A (m²)"
        value={area}
        min={0.0005}
        max={0.02}
        onChange={setArea}
        format={(v) => `${(v * 1e4).toFixed(1)} cm²`}
      />

      <View style={[styles.readout, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>Normal stress σ</Text>
          <Text style={[styles.readVal, { color: colors.tint }]}>{stressLabel}</Text>
        </View>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>σ = F / A</Text>
          <Text style={[styles.readVal, { color: colors.textSecondary }]}>
            {force.toFixed(1)} kN / {(area * 1e4).toFixed(1)} cm²
          </Text>
        </View>
      </View>

      <Text style={[styles.barCap, { color: colors.textSecondary }]}>Stress intensity (caps at 200 MPa)</Text>
      <View style={styles.barTrack}>
        <Svg width={boxW} height={22}>
          <Rect x={0} y={0} width={boxW} height={22} rx={8} fill={colors.chartFill} stroke={colors.border} />
          <Rect
            x={2}
            y={2}
            width={Math.max(0, (boxW - 4) * stressFrac)}
            height={18}
            rx={6}
            fill={sigMPa > 100 ? colors.warning : colors.tint}
          />
        </Svg>
      </View>

      <View style={styles.svgWrap} onLayout={onLayout}>
        <Svg width={boxW} height={svgH}>
          <Rect
            x={0} y={0} width={boxW} height={svgH}
            fill={colors.chartFill} stroke={colors.border} strokeWidth={1} rx={12}
          />
          {/* Wall hatch at left */}
          <Rect x={barLeft - 8} y={barMidY - barThick / 2 - 8} width={8} height={barThick + 16} fill={colors.textMuted} rx={2} />
          {/* Bar */}
          <Rect
            x={barLeft}
            y={barMidY - barThick / 2}
            width={barLen}
            height={barThick}
            fill={colors.tint}
            opacity={0.25}
            rx={4}
          />
          <Rect
            x={barLeft}
            y={barMidY - barThick / 2}
            width={barLen}
            height={barThick}
            fill="none"
            stroke={colors.tint}
            strokeWidth={2}
            rx={4}
          />
          {/* Force arrow (tension: pulling right) */}
          <Line
            x1={barLeft + barLen + 4}
            y1={barMidY}
            x2={barLeft + barLen + 4 + arrowLen}
            y2={barMidY}
            stroke={colors.warning}
            strokeWidth={4}
            strokeLinecap="round"
          />
          <Polygon
            points={`${barLeft + barLen + 4 + arrowLen},${barMidY} ${barLeft + barLen + 4 + arrowLen - 10},${barMidY - 6} ${barLeft + barLen + 4 + arrowLen - 10},${barMidY + 6}`}
            fill={colors.warning}
          />
          <SvgText
            x={barLeft + barLen + arrowLen + 18}
            y={barMidY + 5}
            fill={colors.text}
            fontSize="14"
            fontWeight="700"
          >
            F
          </SvgText>
          {/* Area label */}
          <SvgText
            x={barLeft + barLen / 2 - 6}
            y={barMidY + 5}
            fill={colors.tint}
            fontSize="13"
            fontWeight="700"
            textAnchor="middle"
          >
            A
          </SvgText>
          {/* Dimension lines for thickness / area */}
          <Line
            x1={barLeft - 18}
            y1={barMidY - barThick / 2}
            x2={barLeft - 18}
            y2={barMidY + barThick / 2}
            stroke={colors.textSecondary}
            strokeWidth={1}
          />
          <Line
            x1={barLeft - 22}
            y1={barMidY - barThick / 2}
            x2={barLeft - 14}
            y2={barMidY - barThick / 2}
            stroke={colors.textSecondary}
            strokeWidth={1}
          />
          <Line
            x1={barLeft - 22}
            y1={barMidY + barThick / 2}
            x2={barLeft - 14}
            y2={barMidY + barThick / 2}
            stroke={colors.textSecondary}
            strokeWidth={1}
          />
          {/* Stress label on diagram */}
          <SvgText
            x={barLeft + barLen / 2 - 6}
            y={svgH - 14}
            fill={colors.textSecondary}
            fontSize="12"
            fontWeight="600"
            textAnchor="middle"
          >
            σ = {sigMPa.toFixed(1)} MPa
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
  readRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  readLabel: { fontSize: 13, fontWeight: '700' },
  readVal: { fontSize: 16, fontWeight: '800', fontVariant: ['tabular-nums'] },
  barCap: { fontSize: 12, fontWeight: '600', marginTop: 8 },
  barTrack: { width: '100%', marginTop: 4 },
  svgWrap: { width: '100%', marginTop: 8 },
});
