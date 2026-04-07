import { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';

import { ParamSlider } from '@/components/ParamSlider';
import { TimeSeriesChart } from '@/components/charts/TimeSeriesChart';
import { secondOrderStep } from '@/lib/stepResponse';
import { useAppColors } from '@/hooks/useAppColors';

export function SecondOrderStepSim() {
  const { colors } = useAppColors();

  const [zeta, setZeta] = useState(0.35);
  const [omegaN, setOmegaN] = useState(2);
  const [chartW, setChartW] = useState(320);

  const series = useMemo(() => {
    const T = 8 / Math.max(omegaN, 0.05);
    const n = 220;
    const pts: { t: number; y: number }[] = [];
    for (let i = 0; i <= n; i++) {
      const t = (T * i) / n;
      pts.push({ t, y: secondOrderStep(t, zeta, omegaN) });
    }
    return pts;
  }, [zeta, omegaN]);

  const onChartLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setChartW(w);
  };

  const regime =
    zeta < 0.98 ? 'Underdamped' : zeta > 1.02 ? 'Overdamped' : 'Near critical';

  return (
    <View style={styles.container}>
      <View style={[styles.callout, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.hint, { color: colors.text }]}>
          Unit step of G(s)=ωₙ²/(s²+2ζωₙs+ωₙ²). Sweep ζ to feel overshoot disappear.
        </Text>
        <Text style={[styles.regime, { color: colors.tint }]}>{regime}</Text>
      </View>

      <ParamSlider
        label="Damping ratio ζ"
        value={zeta}
        min={0.05}
        max={2}
        onChange={setZeta}
        format={(v) => v.toFixed(2)}
      />
      <ParamSlider
        label="Natural frequency ωₙ (rad/s)"
        value={omegaN}
        min={0.3}
        max={6}
        onChange={setOmegaN}
        format={(v) => v.toFixed(2)}
      />

      <View style={styles.chartBox} onLayout={onChartLayout}>
        <TimeSeriesChart
          series={series}
          width={chartW}
          height={220}
          yLabel="Output y(t) for unit step"
          yMin={0}
          yMax={zeta < 0.2 ? 2.0 : 1.6}
        />
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
  regime: { fontSize: 12, fontWeight: '800', marginTop: 8, letterSpacing: 0.8 },
  chartBox: { marginTop: 10, width: '100%' },
});
