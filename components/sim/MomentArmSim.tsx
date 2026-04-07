import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, Platform, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Polygon, Rect, Text as SvgText } from 'react-native-svg';

import { ParamSlider } from '@/components/ParamSlider';
import { useAppColors } from '@/hooks/useAppColors';

const HAPTIC_STEP = 25;

export function MomentArmSim() {
  const { colors } = useAppColors();

  const [F, setF] = useState(120);
  const [d, setD] = useState(1.2);
  const [boxW, setBoxW] = useState(320);

  const M = F * d;
  const prevBucket = useRef(Math.floor(M / HAPTIC_STEP));

  useEffect(() => {
    const b = Math.floor(M / HAPTIC_STEP);
    if (b !== prevBucket.current && Platform.OS !== 'web') {
      prevBucket.current = b;
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [M]);

  const h = 210;
  const pivotX = 72;
  const pivotY = h - 80;
  const maxLen = Math.max(32, boxW - pivotX - 40);
  const len = Math.min(d * 58, maxLen);
  const armEndX = pivotX + len;
  const armEndY = pivotY;
  const arrowLen = Math.min(50, F / 6);
  const arrowTipY = armEndY + arrowLen;

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setBoxW(w);
  };

  const arrowColor = colors.tint;

  return (
    <View style={styles.container}>
      <View style={[styles.callout, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.hint, { color: colors.text }]}>
          Perpendicular force and lever arm: M = F·d. Haptics tick when the moment crosses coarse
          steps (device only).
        </Text>
      </View>

      <ParamSlider label="Force F (N)" value={F} min={10} max={300} onChange={setF} format={(v) => `${v.toFixed(0)} N`} />
      <ParamSlider label="Arm d (m)" value={d} min={0.2} max={2.5} onChange={setD} format={(v) => `${v.toFixed(2)} m`} />

      <View style={[styles.momentPill, { backgroundColor: colors.heroOverlay }]}>
        <Text style={[styles.momentLabel, { color: colors.textSecondary }]}>Moment magnitude</Text>
        <Text style={[styles.moment, { color: colors.tint }]}>{M.toFixed(1)} N·m</Text>
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
          <Circle cx={pivotX} cy={pivotY} r={9} fill={colors.textMuted} />
          {/* Lever arm (horizontal) */}
          <Line
            x1={pivotX}
            y1={pivotY}
            x2={armEndX}
            y2={armEndY}
            stroke={colors.textMuted}
            strokeWidth={5}
            strokeLinecap="round"
          />
          {/* Force arrow (perpendicular / downward) */}
          <Line
            x1={armEndX}
            y1={armEndY}
            x2={armEndX}
            y2={arrowTipY}
            stroke={arrowColor}
            strokeWidth={4}
            strokeLinecap="round"
          />
          <Polygon
            points={`${armEndX},${arrowTipY + 2} ${armEndX - 8},${arrowTipY - 12} ${armEndX + 8},${arrowTipY - 12}`}
            fill={arrowColor}
          />
          <SvgText x={pivotX + len / 2 - 8} y={pivotY - 12} fill={colors.text} fontSize="13" fontWeight="600">
            d⊥
          </SvgText>
          <SvgText x={armEndX + 10} y={armEndY + arrowLen / 2 + 4} fill={colors.text} fontSize="13" fontWeight="600">
            F
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
  momentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginTop: 4,
  },
  momentLabel: { fontSize: 13, fontWeight: '600' },
  moment: { fontSize: 20, fontWeight: '800', fontVariant: ['tabular-nums'] },
  svgWrap: { width: '100%', marginTop: 8 },
});
