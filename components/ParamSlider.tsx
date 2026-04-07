import Slider from '@react-native-community/slider';
import { StyleSheet, Text, View } from 'react-native';

import { useAppColors } from '@/hooks/useAppColors';

type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
};

export function ParamSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format = (v) => v.toFixed(3),
}: Props) {
  const { colors } = useAppColors();

  return (
    <View style={[styles.wrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.val, { color: colors.tint, backgroundColor: colors.heroOverlay }]}>
          {format(value)}
        </Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step ?? (max - min) / 200}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={colors.tint}
        maximumTrackTintColor={colors.borderStrong}
        thumbTintColor={colors.tint}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginVertical: 6,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: { fontSize: 14, fontWeight: '700' },
  val: {
    fontSize: 13,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  slider: { width: '100%', height: 40 },
});
