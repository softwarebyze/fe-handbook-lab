import { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Polyline, Rect, Text as SvgText } from 'react-native-svg';

import { ParamSlider } from '@/components/ParamSlider';
import { useAppColors } from '@/hooks/useAppColors';

function buildStressStrainCurve(E: number, sigmaY: number) {
  const pts: { strain: number; stress: number }[] = [];
  const epsY = sigmaY / E;
  const n = 160;
  const maxStrain = Math.max(epsY * 3.5, 0.01);

  for (let i = 0; i <= n; i++) {
    const eps = (maxStrain * i) / n;
    if (eps <= epsY) {
      pts.push({ strain: eps, stress: E * eps });
    } else {
      const plastic = eps - epsY;
      const hardening = sigmaY * 0.15 * (1 - Math.exp(-plastic / (epsY * 4)));
      pts.push({ strain: eps, stress: sigmaY + hardening });
    }
  }
  return { pts, epsY, maxStrain };
}

export function StressStrainSim() {
  const { colors } = useAppColors();

  const [force, setForce] = useState(50);
  const [area, setArea] = useState(500);
  const [modulus, setModulus] = useState(200);
  const [yieldStr, setYieldStr] = useState(250);
  const [chartW, setChartW] = useState(320);

  const areaM2 = area * 1e-6;
  const sigmaY_MPa = yieldStr;
  const sigma = force * 1e3 / areaM2 / 1e6;
  const epsilon = sigma / (modulus * 1e3);
  const isYielded = sigma >= sigmaY_MPa;

  const curve = useMemo(
    () => buildStressStrainCurve(modulus * 1e3, sigmaY_MPa),
    [modulus, sigmaY_MPa]
  );

  const svgH = 220;
  const pad = { l: 10, r: 10, t: 10, b: 22 };
  const innerW = chartW - pad.l - pad.r;
  const innerH = svgH - pad.t - pad.b;

  const maxSigmaPlot = Math.max(sigmaY_MPa * 1.25, sigma * 1.1, 50);
  const maxEpsPlot = curve.maxStrain;

  const toX = (eps: number) => pad.l + (eps / maxEpsPlot) * innerW;
  const toY = (sig: number) => pad.t + innerH * (1 - sig / maxSigmaPlot);

  const polyPoints = useMemo(
    () => curve.pts.map((p) => `${toX(p.strain)},${toY(p.stress)}`).join(' '),
    [curve, chartW, maxSigmaPlot]
  );

  const markerEps = Math.min(epsilon, maxEpsPlot);
  const markerSig = Math.min(sigma, maxSigmaPlot);
  const mx = toX(markerEps);
  const my = toY(markerSig);

  const yieldLineY = toY(sigmaY_MPa);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setChartW(w);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.callout, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.hint, { color: colors.text }]}>
          Axial bar under tension: σ = F/A. Elastic regime follows Hooke's law ε = σ/E. The curve
          shows an idealized stress–strain relationship with mild hardening past yield.
        </Text>
      </View>

      <ParamSlider
        label="Axial force F (kN)"
        value={force}
        min={1}
        max={300}
        onChange={setForce}
        format={(v) => `${v.toFixed(0)} kN`}
      />
      <ParamSlider
        label="Cross-section A (mm²)"
        value={area}
        min={50}
        max={2000}
        onChange={setArea}
        format={(v) => `${v.toFixed(0)} mm²`}
      />
      <ParamSlider
        label="Young's modulus E (GPa)"
        value={modulus}
        min={30}
        max={400}
        onChange={setModulus}
        format={(v) => `${v.toFixed(0)} GPa`}
      />
      <ParamSlider
        label="Yield strength σ_y (MPa)"
        value={yieldStr}
        min={50}
        max={1000}
        onChange={setYieldStr}
        format={(v) => `${v.toFixed(0)} MPa`}
      />

      <View style={[styles.readout, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>Normal stress σ</Text>
          <Text style={[styles.readVal, { color: isYielded ? colors.danger : colors.tint }]}>
            {sigma.toFixed(1)} MPa
          </Text>
        </View>
        <View style={styles.readRow}>
          <Text style={[styles.readLabel, { color: colors.textMuted }]}>Axial strain ε</Text>
          <Text style={[styles.readVal, { color: colors.tint }]}>
            {epsilon < 0.001 ? epsilon.toExponential(2) : epsilon.toFixed(4)}
          </Text>
        </View>
        {isYielded && (
          <Text style={[styles.yieldWarn, { color: colors.danger }]}>
            Stress exceeds yield — plastic deformation begins
          </Text>
        )}
      </View>

      <Text style={[styles.chartLabel, { color: colors.textSecondary }]}>Stress–strain curve</Text>
      <View style={styles.chartBox} onLayout={onLayout}>
        <Svg width={chartW} height={svgH}>
          <Rect
            x={0}
            y={0}
            width={chartW}
            height={svgH}
            fill={colors.chartFill}
            stroke={colors.border}
            strokeWidth={1}
            rx={12}
          />

          {[0.25, 0.5, 0.75].map((g) => {
            const gy = pad.t + innerH * (1 - g);
            return (
              <Line
                key={g}
                x1={pad.l}
                y1={gy}
                x2={chartW - pad.r}
                y2={gy}
                stroke={colors.chartGrid}
                strokeWidth={1}
                opacity={0.6}
              />
            );
          })}

          {yieldLineY >= pad.t && yieldLineY <= pad.t + innerH && (
            <Line
              x1={pad.l}
              y1={yieldLineY}
              x2={chartW - pad.r}
              y2={yieldLineY}
              stroke={colors.warning}
              strokeDasharray="6 4"
              strokeWidth={1.2}
              opacity={0.7}
            />
          )}

          <Polyline
            points={polyPoints}
            fill="none"
            stroke={colors.tint}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <Circle cx={mx} cy={my} r={6} fill={isYielded ? colors.danger : colors.tint} />

          <SvgText
            x={chartW - pad.r - 4}
            y={svgH - 4}
            fill={colors.textMuted}
            fontSize="10"
            textAnchor="end"
          >
            ε →
          </SvgText>
          <SvgText x={pad.l + 2} y={pad.t + 12} fill={colors.textMuted} fontSize="10">
            σ ↑
          </SvgText>
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
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
  yieldWarn: { fontSize: 12, fontWeight: '700', textAlign: 'center', marginTop: 2 },
  chartLabel: { fontSize: 12, fontWeight: '600', marginTop: 8, letterSpacing: 0.2 },
  chartBox: { marginTop: 4, width: '100%' },
});
