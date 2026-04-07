import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAppColors } from '@/hooks/useAppColors';
import type { QuizItem } from '@/types/content';
import { applySm2, getSrsForQuizItem, setSrsForQuizItem, type Grade } from '@/lib/srs';

type Props = {
  items: QuizItem[];
  title: string;
  onDone?: () => void;
};

export function QuizRunner({ items, title, onDone }: Props) {
  const router = useRouter();
  const { colors } = useAppColors();

  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const q = items[idx];
  const done = idx >= items.length;

  const finish = useCallback(() => {
    if (onDone) onDone();
    else router.back();
  }, [onDone, router]);

  if (done || items.length === 0) {
    const pct =
      items.length > 0 ? Math.round((correctCount / items.length) * 100) : 0;
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <View style={[styles.celebrateIcon, { backgroundColor: colors.successMuted }]}>
          <FontAwesome name="check" size={40} color={colors.success} />
        </View>
        <Text style={[styles.doneTitle, { color: colors.text }]}>Session complete</Text>
        <Text style={[styles.doneScore, { color: colors.textSecondary }]}>
          {correctCount} / {items.length} correct ({pct}%)
        </Text>
        <Text style={[styles.doneHint, { color: colors.textMuted }]}>
          Spaced-repetition ratings help lock in what matters for exam day.
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.btn,
            { backgroundColor: colors.tint, opacity: pressed ? 0.9 : 1 },
          ]}
          onPress={finish}>
          <Text style={styles.btnText}>Done</Text>
        </Pressable>
      </View>
    );
  }

  const reveal = picked !== null;
  const correct = picked === q.correctIndex;

  const progress = ((idx + (picked !== null ? 1 : 0)) / items.length) * 100;

  const onPick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.correctIndex) {
      setCorrectCount((c) => c + 1);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const onContinue = () => {
    setPicked(null);
    setIdx((n) => n + 1);
  };

  const onSrs = async (g: Grade) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const now = Date.now();
    const prev = await getSrsForQuizItem(q.id);
    const next = applySm2(prev, g, now);
    await setSrsForQuizItem(q.id, next);
    onContinue();
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled">
      <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
        <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.tint }]} />
      </View>

      <Text style={[styles.small, { color: colors.textMuted }]}>
        {title} · Question {idx + 1} of {items.length}
      </Text>
      <Text style={[styles.question, { color: colors.text }]}>{q.question}</Text>

      {q.choices.map((c, i) => {
        const show = reveal;
        const isCorrect = i === q.correctIndex;
        const isPicked = i === picked;
        const borderColor = colors.border;
        let bg: string = colors.surface;
        let borderW = 1.5;
        if (show) {
          if (isCorrect) {
            bg = colors.successMuted;
            borderW = 2;
          } else if (isPicked && !isCorrect) {
            bg = colors.dangerMuted;
            borderW = 2;
          }
        }
        const bord =
          show && isCorrect ? colors.success : show && isPicked && !isCorrect ? colors.danger : borderColor;
        return (
          <Pressable
            key={i}
            style={[
              styles.choice,
              {
                backgroundColor: bg,
                borderColor: bord,
                borderWidth: borderW,
              },
            ]}
            onPress={() => onPick(i)}
            disabled={reveal}>
            <Text style={[styles.choiceLetter, { color: colors.tint }]}>{String.fromCharCode(65 + i)}</Text>
            <Text style={[styles.choiceText, { color: colors.text }]}>{c}</Text>
          </Pressable>
        );
      })}

      {reveal ? (
        <View style={[styles.block, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.feedbackRow}>
            <FontAwesome
              name={correct ? 'check-circle' : 'times-circle'}
              size={22}
              color={correct ? colors.success : colors.danger}
            />
            <Text
              style={[
                styles.feedback,
                { color: correct ? colors.success : colors.danger },
              ]}>
              {correct ? 'Correct' : 'Incorrect'}
            </Text>
          </View>
          <Text style={[styles.explain, { color: colors.textSecondary }]}>{q.explanation}</Text>
          <Text style={[styles.srsLabel, { color: colors.text }]}>How well did you recall it?</Text>
          <View style={styles.srsGrid}>
            <Pressable
              style={({ pressed }) => [
                styles.srsBtn,
                { borderColor: colors.danger, opacity: pressed ? 0.85 : 1 },
              ]}
              onPress={() => void onSrs('again')}>
              <Text style={[styles.srsBtnText, { color: colors.danger }]}>Again</Text>
              <Text style={[styles.srsHint, { color: colors.textMuted }]}>Soon</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.srsBtn,
                { borderColor: colors.tint, opacity: pressed ? 0.85 : 1 },
              ]}
              onPress={() => void onSrs('good')}>
              <Text style={[styles.srsBtnText, { color: colors.tint }]}>Good</Text>
              <Text style={[styles.srsHint, { color: colors.textMuted }]}>Default</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.srsBtn,
                { borderColor: colors.success, opacity: pressed ? 0.85 : 1 },
              ]}
              onPress={() => void onSrs('easy')}>
              <Text style={[styles.srsBtnText, { color: colors.success }]}>Easy</Text>
              <Text style={[styles.srsHint, { color: colors.textMuted }]}>Later</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 48 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 28 },
  celebrateIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  doneTitle: { fontSize: 24, fontWeight: '800', marginBottom: 8, letterSpacing: -0.3 },
  doneScore: { fontSize: 17, fontWeight: '600', marginBottom: 10, fontVariant: ['tabular-nums'] },
  doneHint: { fontSize: 14, lineHeight: 21, textAlign: 'center', marginBottom: 28, maxWidth: 300 },
  progressTrack: { height: 5, borderRadius: 3, overflow: 'hidden', marginBottom: 18 },
  progressFill: { height: '100%', borderRadius: 3 },
  small: { fontSize: 13, marginBottom: 10, fontWeight: '600' },
  question: { fontSize: 19, fontWeight: '700', marginBottom: 20, lineHeight: 28, letterSpacing: -0.2 },
  choice: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 10,
    gap: 12,
  },
  choiceLetter: {
    fontSize: 15,
    fontWeight: '800',
    width: 28,
    textAlign: 'center',
  },
  choiceText: { flex: 1, fontSize: 16, lineHeight: 22, fontWeight: '500' },
  block: {
    marginTop: 8,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  feedbackRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  feedback: { fontSize: 18, fontWeight: '800' },
  explain: { fontSize: 15, lineHeight: 23, marginBottom: 18 },
  srsLabel: { fontSize: 14, fontWeight: '700', marginBottom: 12 },
  srsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  srsBtn: {
    flex: 1,
    minWidth: '28%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  srsBtnText: { fontWeight: '800', fontSize: 15 },
  srsHint: { fontSize: 11, marginTop: 2, fontWeight: '600' },
  btn: { paddingHorizontal: 36, paddingVertical: 14, borderRadius: 14 },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
