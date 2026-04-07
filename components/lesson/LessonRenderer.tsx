import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';

import { MathBlock } from '@/components/math/MathBlock';
import { Fonts } from '@/constants/Typography';
import { useAppColors } from '@/hooks/useAppColors';
import type { LessonBlock } from '@/types/content';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = { blocks: LessonBlock[] };

export function LessonRenderer({ blocks }: Props) {
  return (
    <View style={styles.stack}>
      {blocks.map((b, i) => (
        <LessonBlockView key={i} block={b} />
      ))}
    </View>
  );
}

function LessonBlockView({ block: b }: { block: LessonBlock }) {
  const { colors, isDark } = useAppColors();
  const router = useRouter();
  const mathBg = isDark ? colors.surfaceElevated : '#f0fdfa';

  switch (b.type) {
    case 'lead':
      return (
        <Text style={[styles.lead, { color: colors.text, fontFamily: Fonts.medium }]}>{b.text}</Text>
      );
    case 'heading':
      return (
        <Text style={[styles.heading, { color: colors.tint, fontFamily: Fonts.bold }]}>{b.text}</Text>
      );
    case 'paragraph':
      return (
        <Text style={[styles.para, { color: colors.textSecondary, fontFamily: Fonts.body }]}>{b.text}</Text>
      );
    case 'math':
      return (
        <View style={styles.mathWrap}>
          <MathBlock
            latex={b.latex}
            display
            textColor={colors.text}
            mathBackground={mathBg}
            minHeight={52}
          />
          {b.caption ? (
            <Text style={[styles.caption, { color: colors.textMuted, fontFamily: Fonts.medium }]}>
              {b.caption}
            </Text>
          ) : null}
        </View>
      );
    case 'bullet':
      return (
        <View style={styles.bullets}>
          {b.items.map((item, j) => (
            <View key={j} style={styles.bulletRow}>
              <Text style={[styles.bulletDot, { color: colors.tint }]}>●</Text>
              <Text style={[styles.bulletText, { color: colors.text, fontFamily: Fonts.body }]}>
                {item}
              </Text>
            </View>
          ))}
        </View>
      );
    case 'callout': {
      const palette =
        b.variant === 'insight'
          ? { border: colors.tint, icon: 'lightbulb-o' as const, bg: colors.heroOverlay }
          : b.variant === 'exam'
            ? { border: colors.warning, icon: 'graduation-cap' as const, bg: colors.surface }
            : { border: colors.tint, icon: 'flask' as const, bg: colors.heroOverlay };
      const inner = (
        <View
          style={[
            styles.callout,
            { borderColor: palette.border, backgroundColor: palette.bg },
            b.variant === 'exam' && styles.calloutExam,
          ]}>
          <FontAwesome name={palette.icon} size={18} color={palette.border} style={styles.calloutIcon} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.calloutTitle, { color: colors.text, fontFamily: Fonts.bold }]}>
              {b.title}
            </Text>
            <Text style={[styles.calloutBody, { color: colors.textSecondary, fontFamily: Fonts.body }]}>
              {b.body}
            </Text>
            {b.variant === 'lab' && b.simId ? (
              <Text style={[styles.tapHint, { color: colors.tint, fontFamily: Fonts.semi }]}>
                Tap to open interactive lab →
              </Text>
            ) : null}
          </View>
        </View>
      );
      if (b.variant === 'lab' && b.simId) {
        return (
          <Pressable
            onPress={() => router.push(`/sim/${b.simId}`)}
            style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }]}>
            {inner}
          </Pressable>
        );
      }
      return inner;
    }
    case 'checkpoint':
      return <Checkpoint title={b.title} body={b.body} />;
    case 'divider':
      return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
    default:
      return null;
  }
}

function Checkpoint({ title, body }: { title: string; body: string }) {
  const { colors } = useAppColors();
  const [open, setOpen] = useState(false);
  return (
    <View style={[styles.cpShell, { borderColor: colors.border, backgroundColor: colors.surface }]}>
      <Pressable
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setOpen((o) => !o);
        }}
        style={styles.cpHead}>
        <FontAwesome name="chevron-right" size={14} color={colors.tint} style={{ transform: [{ rotate: open ? '90deg' : '0deg' }] }} />
        <Text style={[styles.cpTitle, { color: colors.text, fontFamily: Fonts.semi }]}>{title}</Text>
      </Pressable>
      {open ? (
        <Text style={[styles.cpBody, { color: colors.textSecondary, fontFamily: Fonts.body }]}>{body}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 4 },
  lead: { fontSize: 19, lineHeight: 30, letterSpacing: -0.3, marginBottom: 8 },
  heading: { fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', marginTop: 18, marginBottom: 8 },
  para: { fontSize: 16, lineHeight: 26, marginBottom: 10 },
  mathWrap: { marginVertical: 4 },
  caption: { fontSize: 12, marginTop: 6, textAlign: 'center' },
  bullets: { marginVertical: 8, gap: 10 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  bulletDot: { fontSize: 8, marginTop: 7 },
  bulletText: { flex: 1, fontSize: 16, lineHeight: 24 },
  callout: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 14,
    marginVertical: 8,
    gap: 12,
  },
  calloutExam: { borderWidth: 2 },
  calloutIcon: { marginTop: 2 },
  calloutTitle: { fontSize: 15, marginBottom: 6 },
  calloutBody: { fontSize: 15, lineHeight: 22 },
  tapHint: { fontSize: 13, marginTop: 10 },
  cpShell: { borderRadius: 14, borderWidth: 1, padding: 4, marginVertical: 8 },
  cpHead: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  cpTitle: { flex: 1, fontSize: 15 },
  cpBody: { paddingHorizontal: 12, paddingBottom: 14, paddingLeft: 36, fontSize: 15, lineHeight: 23 },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 14 },
});
