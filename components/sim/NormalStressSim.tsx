import { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Polygon, Rect, Text as SvgText } from 'react-native-svg';

import { ParamSlider } from '@/components/ParamSlider';
import { useAppColors } from '@/hooks/useAppColors';

export function NormalStressSim() {
  const { colors } = useAppColors();

  const [force, setForce] = useState(50);
  const [diameter, setDiameter] = useState(25);
  const [boxW, setBoxW] = useState(320);

  const areaMm2 = Math.PI * (diameter / 2) ** 2;
  const areaM2 = areaMm2 * 1e-6;
  const forceN = force * 1e3;
  const stressMPa = forceN / areaM2 / 1e6;

  const h = 220;
  const cx = boxW / 2;
  const cy = h / 2;
  const barLen = 160;
  const minBarH = 14;
  const maxBarH = 70;
  const barH = useMemo(
    () => minBarH + ((diameter - 5) / (80 - 5)) * (maxBarH - minBarH),
    [diameter]
  );

  const stressColor = stressMPa > 250 ? colors.danger : colors.tint;

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setBoxW(w);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.callout, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.hint, { color: colors.text }]}>
          Axial bar under tension: σ = F / A. Set force and cross-section diameter;
          watch stress rise as area shrinks. Stress turns red above 250 MPa (typical
          mild-steel yield).
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
        label="Bar diameter d (mm)"
        value={diameter}
        min={5}
        max={80}
        onChange={setDiameter}
        format={(v) => `${v.toFixed(1)} mm`}
      />

      <View style={[styles.readout, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>Cross-section area A</Text>
          <Text style={[styles.readVal, { color: colors.textSecondary }]}>{areaMm2.toFixed(1)} mm²</Text>
        </View>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>Normal stress σ</Text>
          <Text style={[styles.readVal, { color: stressColor }]}>{stressMPa.toFixed(1)} MPa</Text>
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
          {/* Bar body */}
          <Rect
            x={cx - barLen / 2}
            y={cy - barH / 2}
            width={barLen}
            height={barH}
            rx={4}
            fill={stressColor}
            opacity={0.25}
            stroke={stressColor}
            strokeWidth={2}
          />

          {/* Left arrow (pull left) */}
          <Line
            x1={cx - barLen / 2 - 6}
            y1={cy}
            x2={cx - barLen / 2 - 40}
            y2={cy}
            stroke={stressColor}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <Polygon
            points={`${cx - barLen / 2 - 40},${cy} ${cx - barLen / 2 - 28},${cy - 7} ${cx - barLen / 2 - 28},${cy + 7}`}
            fill={stressColor}
          />

          {/* Right arrow (pull right) */}
          <Line
            x1={cx + barLen / 2 + 6}
            y1={cy}
            x2={cx + barLen / 2 + 40}
            y2={cy}
            stroke={stressColor}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <Polygon
            points={`${cx + barLen / 2 + 40},${cy} ${cx + barLen / 2 + 28},${cy - 7} ${cx + barLen / 2 + 28},${cy + 7}`}
            fill={stressColor}
          />

          {/* Labels */}
          <SvgText x={cx - barLen / 2 - 38} y={cy - 16} fill={colors.text} fontSize="13" fontWeight="700">
            F
          </SvgText>
          <SvgText x={cx + barLen / 2 + 24} y={cy - 16} fill={colors.text} fontSize="13" fontWeight="700">
            F
          </SvgText>

          {/* Diameter dimension line */}
          <Line
            x1={cx + barLen / 2 + 14}
            y1={cy - barH / 2}
            x2={cx + barLen / 2 + 14}
            y2={cy + barH / 2}
            stroke={colors.textSecondary}
            strokeWidth={1}
            strokeDasharray="4 3"
          />
          <SvgText
            x={cx + barLen / 2 + 20}
            y={cy + 4}
            fill={colors.textSecondary}
            fontSize="11"
            fontWeight="600"
          >
            d
          </SvgText>

          {/* Stress readout in diagram */}
          <SvgText
            x={cx}
            y={cy + 5}
            fill={stressColor}
            fontSize="15"
            fontWeight="800"
            textAnchor="middle"
          >
            σ = {stressMPa.toFixed(1)} MPa
          </SvgText>
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  callout: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 4,
  },
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
