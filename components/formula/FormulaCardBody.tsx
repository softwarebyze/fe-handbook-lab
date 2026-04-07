import { StyleSheet, Text, View } from 'react-native';

import { MathBlock } from '@/components/math/MathBlock';
import { Fonts } from '@/constants/Typography';
import { useAppColors } from '@/hooks/useAppColors';
import type { FormulaCard } from '@/types/content';

/** Renders title + KaTeX + variable legend. */
export function FormulaCardBody({ card }: { card: FormulaCard }) {
  const { colors, isDark } = useAppColors();
  const latex = card.latex ?? `\\displaystyle\\text{${escapeText(card.expression)}}`;
  const mathBg = isDark ? colors.surfaceElevated : '#f0fdfa';

  return (
    <View>
      <Text style={[styles.title, { color: colors.text, fontFamily: Fonts.bold }]}>{card.title}</Text>
      <MathBlock
        latex={latex}
        display
        textColor={colors.text}
        mathBackground={mathBg}
        minHeight={56}
      />
      <View style={styles.vars}>
        {card.variables.map((v) => (
          <View key={v.symbol} style={[styles.varRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.sym, { color: colors.tint, fontFamily: Fonts.semi }]}>{v.symbol}</Text>
            <Text style={[styles.varBody, { color: colors.textSecondary, fontFamily: Fonts.body }]}>
              {v.name}
              {v.units ? ` · ${v.units}` : ''}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function escapeText(s: string) {
  return s.replace(/\\/g, '\\textbackslash ').replace(/[{}]/g, '');
}

const styles = StyleSheet.create({
  title: { fontSize: 16, marginBottom: 10, letterSpacing: -0.2 },
  vars: { marginTop: 12 },
  varRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  sym: { fontSize: 15, minWidth: 36 },
  varBody: { flex: 1, fontSize: 14, lineHeight: 20 },
});
