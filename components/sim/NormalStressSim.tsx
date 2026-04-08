import { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, {
  Defs,
  Line,
  LinearGradient,
  Polygon,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

import { ParamSlider } from '@/components/ParamSlider';
import { useAppColors } from '@/hooks/useAppColors';

const YIELD_STEEL = 250; // MPa — mild steel, for reference band

export function NormalStressSim() {
  const { colors } = useAppColors();

  const [force, setForce] = useState(50); // kN
  const [diameter, setDiameter] = useState(25); // mm

  const [boxW, setBoxW] = useState(320);

  const areaM2 = Math.PI * (diameter / 2000) ** 2;
  const areaMm2 = Math.PI * (diameter / 2) ** 2;
  const stressMPa = (force * 1e3) / areaM2 / 1e6;

  const ratio = stressMPa / YIELD_STEEL;
  const dangerLevel =
    ratio < 0.6 ? 'safe' : ratio < 0.9 ? 'caution' : 'yield-zone';

  const dangerColor =
    dangerLevel === 'safe'
      ? colors.success
      : dangerLevel === 'caution'
        ? colors.warning
        : colors.danger;

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setBoxW(w);
  };

  const svgH = 190;
  const barLeft = 60;
  const barRight = boxW - 60;
  const barW = barRight - barLeft;
  const barTop = 60;
  const barH = Math.max(18, Math.min(60, diameter * 1.6));
  const barCy = barTop + barH / 2;

  const fillFrac = useMemo(() => Math.min(1, stressMPa / YIELD_STEEL), [stressMPa]);
  const fillW = barW * fillFrac;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.callout,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.hint, { color: colors.text }]}>
          Average normal stress σ = F/A on a prismatic bar. Set axial force and
          cross-section diameter; see how stress scales inversely with area.
        </Text>
      </View>

      <ParamSlider
        label="Axial force F (kN)"
        value={force}
        min={1}
        max={300}
        onChange={setForce}
        format={(v) => `${v.toFixed(1)} kN`}
      />
      <ParamSlider
        label="Diameter d (mm)"
        value={diameter}
        min={5}
        max={60}
        onChange={setDiameter}
        format={(v) => `${v.toFixed(1)} mm`}
      />

      <View
        style={[
          styles.readout,
          { borderColor: colors.border, backgroundColor: colors.surface },
        ]}
      >
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>
            Area A
          </Text>
          <Text style={[styles.readVal, { color: colors.text }]}>
            {areaMm2.toFixed(1)} mm²
          </Text>
        </View>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>
            Stress σ
          </Text>
          <Text style={[styles.readVal, { color: dangerColor }]}>
            {stressMPa.toFixed(1)} MPa
          </Text>
        </View>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>
            σ / σ_y (mild steel ≈ 250 MPa)
          </Text>
          <Text style={[styles.readVal, { color: dangerColor }]}>
            {(ratio * 100).toFixed(1)}%
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

          <Defs>
            <LinearGradient id="stressFill" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={colors.success} stopOpacity={0.7} />
              <Stop
                offset="1"
                stopColor={dangerColor}
                stopOpacity={0.85}
              />
            </LinearGradient>
          </Defs>

          {/* Bar outline */}
          <Rect
            x={barLeft}
            y={barTop}
            width={barW}
            height={barH}
            rx={4}
            fill={colors.surface}
            stroke={colors.borderStrong}
            strokeWidth={1.5}
          />

          {/* Stress fill */}
          <Rect
            x={barLeft}
            y={barTop}
            width={fillW}
            height={barH}
            rx={4}
            fill="url(#stressFill)"
          />

          {/* Left arrow (reaction) */}
          <Line
            x1={barLeft - 4}
            y1={barCy}
            x2={barLeft - 32}
            y2={barCy}
            stroke={colors.tint}
            strokeWidth={3}
          />
          <Polygon
            points={`${barLeft - 32},${barCy} ${barLeft - 22},${barCy - 7} ${barLeft - 22},${barCy + 7}`}
            fill={colors.tint}
          />

          {/* Right arrow (applied force) */}
          <Line
            x1={barRight + 4}
            y1={barCy}
            x2={barRight + 32}
            y2={barCy}
            stroke={colors.tint}
            strokeWidth={3}
          />
          <Polygon
            points={`${barRight + 32},${barCy} ${barRight + 22},${barCy - 7} ${barRight + 22},${barCy + 7}`}
            fill={colors.tint}
          />

          {/* Labels */}
          <SvgText
            x={barLeft - 18}
            y={barCy - 16}
            fill={colors.textSecondary}
            fontSize="11"
            fontWeight="600"
            textAnchor="middle"
          >
            R
          </SvgText>
          <SvgText
            x={barRight + 18}
            y={barCy - 16}
            fill={colors.textSecondary}
            fontSize="11"
            fontWeight="600"
            textAnchor="middle"
          >
            F
          </SvgText>

          {/* Diameter annotation */}
          <Line
            x1={barLeft + barW / 2}
            y1={barTop - 4}
            x2={barLeft + barW / 2}
            y2={barTop + barH + 4}
            stroke={colors.textMuted}
            strokeWidth={0.8}
            strokeDasharray="3 3"
          />
          <SvgText
            x={barLeft + barW / 2}
            y={barTop + barH + 18}
            fill={colors.textMuted}
            fontSize="11"
            fontWeight="600"
            textAnchor="middle"
          >
            d = {diameter.toFixed(0)} mm
          </SvgText>

          {/* Status badge */}
          <SvgText
            x={barLeft + barW / 2}
            y={svgH - 10}
            fill={dangerColor}
            fontSize="11"
            fontWeight="800"
            textAnchor="middle"
          >
            {dangerLevel === 'safe'
              ? 'Below yield'
              : dangerLevel === 'caution'
                ? 'Approaching yield'
                : 'At / above yield stress'}
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
