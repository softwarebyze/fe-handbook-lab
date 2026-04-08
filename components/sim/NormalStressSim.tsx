import { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Polygon, Rect, Text as SvgText } from 'react-native-svg';

import { ParamSlider } from '@/components/ParamSlider';
import { useAppColors } from '@/hooks/useAppColors';

const MAX_STRESS_DISPLAY = 500; // MPa cap for bar gauge

export function NormalStressSim() {
  const { colors } = useAppColors();
  const [force, setForce] = useState(50); // kN
  const [area, setArea] = useState(500); // mm²
  const [boxW, setBoxW] = useState(320);

  const F_N = force * 1000;
  const A_m2 = area * 1e-6;
  const sigma = A_m2 > 0 ? F_N / A_m2 : 0; // Pa
  const sigmaMPa = sigma / 1e6;

  const stressFrac = useMemo(
    () => Math.min(1, Math.abs(sigmaMPa) / MAX_STRESS_DISPLAY),
    [sigmaMPa],
  );

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setBoxW(w);
  };

  const h = 200;
  const barCx = boxW / 2;
  const barCy = h / 2;
  const barLen = Math.max(60, boxW * 0.52);
  const halfLen = barLen / 2;

  const areaRef = 1000;
  const sideHalf = Math.max(8, 32 * Math.sqrt(area / areaRef));

  const arrowLen = 28;
  const arrowGap = 6;
  const arrowColor = force >= 0 ? colors.tint : colors.danger;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.callout,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}>
        <Text style={[styles.hint, { color: colors.text }]}>
          Average normal stress σ = F / A on a prismatic bar. Positive F = tension;
          the cross-section scales with area.
        </Text>
      </View>

      <ParamSlider
        label="Axial force F (kN)"
        value={force}
        min={-200}
        max={200}
        onChange={setForce}
        format={(v) => `${v.toFixed(1)} kN`}
      />
      <ParamSlider
        label="Cross-section area A (mm²)"
        value={area}
        min={50}
        max={2000}
        onChange={setArea}
        format={(v) => `${v.toFixed(0)} mm²`}
      />

      <View
        style={[
          styles.readout,
          { borderColor: colors.border, backgroundColor: colors.surface },
        ]}>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>
            Stress σ
          </Text>
          <Text
            style={[
              styles.readVal,
              {
                color:
                  Math.abs(sigmaMPa) > 250 ? colors.danger : colors.tint,
              },
            ]}>
            {sigmaMPa.toFixed(2)} MPa
          </Text>
        </View>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>
            State
          </Text>
          <Text
            style={[
              styles.readState,
              {
                color:
                  force > 0
                    ? colors.tint
                    : force < 0
                      ? colors.danger
                      : colors.textMuted,
              },
            ]}>
            {force > 0 ? 'Tension' : force < 0 ? 'Compression' : 'Zero load'}
          </Text>
        </View>
      </View>

      <Text style={[styles.barCap, { color: colors.textSecondary }]}>
        |σ| gauge (caps at {MAX_STRESS_DISPLAY} MPa)
      </Text>
      <View style={styles.barTrack} onLayout={onLayout}>
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
            width={Math.max(0, (boxW - 4) * stressFrac)}
            height={18}
            rx={6}
            fill={Math.abs(sigmaMPa) > 250 ? colors.danger : colors.tint}
            opacity={0.85}
          />
        </Svg>
      </View>

      <View style={styles.svgWrap}>
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
            x={barCx - halfLen}
            y={barCy - sideHalf}
            width={barLen}
            height={sideHalf * 2}
            fill={colors.heroOverlay}
            stroke={colors.borderStrong}
            strokeWidth={1.5}
            rx={3}
          />

          {/* Left arrow (tension pulls left, compression pushes right) */}
          <Line
            x1={barCx - halfLen - arrowGap - arrowLen}
            y1={barCy}
            x2={barCx - halfLen - arrowGap}
            y2={barCy}
            stroke={arrowColor}
            strokeWidth={4}
            strokeLinecap="round"
          />
          <Polygon
            points={
              force >= 0
                ? `${barCx - halfLen - arrowGap - arrowLen},${barCy} ${barCx - halfLen - arrowGap - arrowLen + 12},${barCy - 7} ${barCx - halfLen - arrowGap - arrowLen + 12},${barCy + 7}`
                : `${barCx - halfLen - arrowGap},${barCy} ${barCx - halfLen - arrowGap - 12},${barCy - 7} ${barCx - halfLen - arrowGap - 12},${barCy + 7}`
            }
            fill={arrowColor}
          />

          {/* Right arrow */}
          <Line
            x1={barCx + halfLen + arrowGap}
            y1={barCy}
            x2={barCx + halfLen + arrowGap + arrowLen}
            y2={barCy}
            stroke={arrowColor}
            strokeWidth={4}
            strokeLinecap="round"
          />
          <Polygon
            points={
              force >= 0
                ? `${barCx + halfLen + arrowGap + arrowLen},${barCy} ${barCx + halfLen + arrowGap + arrowLen - 12},${barCy - 7} ${barCx + halfLen + arrowGap + arrowLen - 12},${barCy + 7}`
                : `${barCx + halfLen + arrowGap},${barCy} ${barCx + halfLen + arrowGap + 12},${barCy - 7} ${barCx + halfLen + arrowGap + 12},${barCy + 7}`
            }
            fill={arrowColor}
          />

          {/* Labels */}
          <SvgText
            x={barCx - halfLen - arrowGap - arrowLen / 2}
            y={barCy - 16}
            fill={colors.text}
            fontSize="13"
            fontWeight="600"
            textAnchor="middle">
            F
          </SvgText>
          <SvgText
            x={barCx + halfLen + arrowGap + arrowLen / 2}
            y={barCy - 16}
            fill={colors.text}
            fontSize="13"
            fontWeight="600"
            textAnchor="middle">
            F
          </SvgText>
          <SvgText
            x={barCx}
            y={barCy + sideHalf + 20}
            fill={colors.textSecondary}
            fontSize="12"
            fontWeight="600"
            textAnchor="middle">
            A = {area.toFixed(0)} mm²
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
  readState: { fontSize: 15, fontWeight: '800' },
  barCap: { fontSize: 12, fontWeight: '600', marginTop: 8 },
  barTrack: { width: '100%', marginTop: 4 },
  svgWrap: { width: '100%', marginTop: 8 },
});
