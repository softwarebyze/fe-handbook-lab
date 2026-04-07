import { StyleSheet, Text, View } from 'react-native';

import type { AppColors } from '@/constants/Colors';

type Props = {
  title: string;
  colors: AppColors;
  right?: string;
};

export function SectionHeading({ title, colors, right }: Props) {
  return (
    <View style={styles.row}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {right ? (
        <Text style={[styles.right, { color: colors.textMuted }]}>{right}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  title: { fontSize: 13, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase' },
  right: { fontSize: 12, fontWeight: '600', fontVariant: ['tabular-nums'] },
});
