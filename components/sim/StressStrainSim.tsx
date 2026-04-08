import { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Polyline, Rect, Text as SvgText } from 'react-native-svg';

import { ParamSlider } from '@/components/ParamSlider';
import { useAppColors } from '@/hooks/useAppColors';

const YIELD_STRAIN = 0.002;

export function StressStrainSim() {
  const { colors } = useAppColors();

  const [force, setForce] = useState(50_000);
  const [area, setArea] = useState(0.0004);
  const [eGpa, setEGpa] = useState(200);
  const [boxW, setBoxW] = useState(320);

  const E = eGpa * 1e9;
  const sigma = force / area;
  const sigmaMPa = sigma / 1e6;
  const epsilon = sigma / E;
  const inElastic = epsilon <= YIELD_STRAIN;

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setBoxW(w);
  };

  const chartH = 200;
  const pl = 44;
  const pr = 14;
  const pt = 14;
  const pb = 28;
  const iw = boxW - pl - pr;
  const ih = chartH - pt - pb;

  const maxStrain = Math.max(YIELD_STRAIN * 1.5, epsilon * 1.3, 0.001);
  const maxStress = Math.max(E * YIELD_STRAIN / 1e6 * 1.2, sigmaMPa * 1.3, 50);

  const chartData = useMemo(() => {
    const yieldStress = E * YIELD_STRAIN / 1e6;
    const pts: string[] = [];
    const steps = 80;
    for (let i = 0; i <= steps; i++) {
      const eps = (maxStrain * i) / steps;
      const sig = eps <= YIELD_STRAIN ? (E * eps) / 1e6 : yieldStress;
      const x = pl + (eps / maxStrain) * iw;
      const y = pt + ih * (1 - sig / maxStress);
      pts.push(`${x},${y}`);
    }
    return pts.join(' ');
  }, [E, maxStrain, maxStress, iw, ih, pl, pt]);

  const dotX = pl + (epsilon / maxStrain) * iw;
  const dotY = pt + ih * (1 - sigmaMPa / maxStress);

  const barH = 160;
  const barPl = 40;
  const barPr = 40;
  const nomW = 48;
  const stretchFactor = Math.min(epsilon * 800, 0.35);
  const squeezeFactor = Math.min(epsilon * 200, 0.25);
  const barLen = (boxW - barPl - barPr);
  const drawnW = nomW * (1 - squeezeFactor);

  return (
    <View style={styles.container}>
      <View style={[styles.callout, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.hint, { color: colors.text }]}>
          Axial stress {"\u03C3"} = F/A and Hooke{"\u2019"}s law {"\u03B5"} = {"\u03C3"}/E. The diagram
          stretches with strain; the curve shows the linear elastic region up to a nominal yield point.
        </Text>
        <Text style={[styles.regime, { color: inElastic ? colors.success : colors.danger }]}>
          {inElastic ? 'Elastic (linear)' : 'Beyond yield'}
        </Text>
      </View>

      <ParamSlider
        label="Axial force F (N)"
        value={force}
        min={1000}
        max={500_000}
        step={500}
        onChange={setForce}
        format={(v) => `${(v / 1000).toFixed(1)} kN`}
      />
      <ParamSlider
        label="Area A (m\u00B2)"
        value={area}
        min={0.0001}
        max={0.005}
        onChange={setArea}
        format={(v) => `${(v * 1e4).toFixed(2)} cm\u00B2`}
      />
      <ParamSlider
        label="Young\u2019s modulus E (GPa)"
        value={eGpa}
        min={10}
        max={400}
        step={1}
        onChange={setEGpa}
        format={(v) => `${v.toFixed(0)} GPa`}
      />

      <View style={[styles.readout, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>Stress {"\u03C3"}</Text>
          <Text style={[styles.readVal, { color: colors.tint }]}>{sigmaMPa.toFixed(2)} MPa</Text>
        </View>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>Strain {"\u03B5"}</Text>
          <Text style={[styles.readVal, { color: colors.tint }]}>
            {epsilon < 0.001 ? epsilon.toExponential(3) : epsilon.toFixed(5)}
          </Text>
        </View>
      </View>

      {/* Stress-strain curve */}
      <Text style={[styles.chartLabel, { color: colors.textSecondary }]}>
        Stress{"\u2013"}strain curve (Hooke{"\u2019"}s region)
      </Text>
      <View onLayout={onLayout}>
        <Svg width={boxW} height={chartH}>
          <Rect x={0} y={0} width={boxW} height={chartH} fill={colors.chartFill} stroke={colors.border} rx={12} />

          {/* axes */}
          <Line x1={pl} y1={pt} x2={pl} y2={pt + ih} stroke={colors.chartGrid} strokeWidth={1} />
          <Line x1={pl} y1={pt + ih} x2={pl + iw} y2={pt + ih} stroke={colors.chartGrid} strokeWidth={1} />

          {/* yield dashed line */}
          <Line
            x1={pl + (YIELD_STRAIN / maxStrain) * iw}
            y1={pt}
            x2={pl + (YIELD_STRAIN / maxStrain) * iw}
            y2={pt + ih}
            stroke={colors.danger}
            strokeDasharray="4 4"
            strokeWidth={1}
            opacity={0.5}
          />

          {/* curve */}
          <Polyline points={chartData} fill="none" stroke={colors.tint} strokeWidth={2.5} />

          {/* operating point dot */}
          <Line
            x1={Math.min(dotX, pl + iw)}
            y1={Math.max(dotY, pt)}
            x2={Math.min(dotX, pl + iw)}
            y2={Math.max(dotY, pt)}
            stroke={colors.warning}
            strokeWidth={10}
            strokeLinecap="round"
          />

          {/* axis labels */}
          <SvgText x={pl + iw / 2} y={chartH - 4} fill={colors.textMuted} fontSize="11" textAnchor="middle">
            Strain {"\u03B5"}
          </SvgText>
          <SvgText x={12} y={pt + ih / 2} fill={colors.textMuted} fontSize="11" textAnchor="middle" rotation="-90" originX={12} originY={pt + ih / 2}>
            {"\u03C3"} (MPa)
          </SvgText>
        </Svg>
      </View>

      {/* Visual bar stretching */}
      <Text style={[styles.chartLabel, { color: colors.textSecondary }]}>
        Axial deformation (exaggerated)
      </Text>
      <Svg width={boxW} height={barH}>
        <Rect x={0} y={0} width={boxW} height={barH} fill={colors.chartFill} stroke={colors.border} rx={12} />

        {/* left wall */}
        <Line x1={barPl} y1={barH / 2 - 40} x2={barPl} y2={barH / 2 + 40} stroke={colors.textMuted} strokeWidth={3} />
        {[0, 1, 2, 3, 4].map((i) => {
          const yy = barH / 2 - 30 + i * 15;
          return (
            <Line key={i} x1={barPl - 8} y1={yy + 6} x2={barPl} y2={yy} stroke={colors.textMuted} strokeWidth={1.5} />
          );
        })}

        {/* bar body */}
        <Rect
          x={barPl}
          y={barH / 2 - drawnW / 2}
          width={barLen * (1 + stretchFactor)}
          height={drawnW}
          fill={inElastic ? colors.tint : colors.danger}
          opacity={0.25}
          rx={4}
        />
        <Rect
          x={barPl}
          y={barH / 2 - drawnW / 2}
          width={barLen * (1 + stretchFactor)}
          height={drawnW}
          fill="none"
          stroke={inElastic ? colors.tint : colors.danger}
          strokeWidth={2}
          rx={4}
        />

        {/* force arrow */}
        <Line
          x1={barPl + barLen * (1 + stretchFactor) + 4}
          y1={barH / 2}
          x2={barPl + barLen * (1 + stretchFactor) + 28}
          y2={barH / 2}
          stroke={colors.warning}
          strokeWidth={3}
        />
        <SvgText
          x={barPl + barLen * (1 + stretchFactor) + 30}
          y={barH / 2 + 5}
          fill={colors.warning}
          fontSize="14"
          fontWeight="700"
        >
          F
        </SvgText>

        {/* dimension label */}
        <SvgText x={barPl + barLen / 2} y={barH / 2 + drawnW / 2 + 18} fill={colors.textSecondary} fontSize="11" textAnchor="middle">
          {"\u03B5"} = {epsilon < 0.001 ? epsilon.toExponential(2) : epsilon.toFixed(4)}
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  callout: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 4 },
  hint: { fontSize: 14, lineHeight: 21, fontWeight: '500' },
  regime: { fontSize: 12, fontWeight: '800', marginTop: 8, letterSpacing: 0.8 },
  readout: { borderRadius: 14, borderWidth: 1, padding: 14, marginTop: 4 },
  readRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  readLabel: { fontSize: 13, fontWeight: '700' },
  readVal: { fontSize: 18, fontWeight: '800', fontVariant: ['tabular-nums'] },
  chartLabel: { fontSize: 12, fontWeight: '600', marginTop: 10, marginBottom: 4 },
});
