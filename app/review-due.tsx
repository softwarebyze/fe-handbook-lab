import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { QuizRunner } from '@/components/QuizRunner';
import { allQuizItems, getQuizItem } from '@/data/corpus';
import { getDueQuizItemIds } from '@/lib/srs';
import { useAppColors } from '@/hooks/useAppColors';
import { AppCard } from '@/components/ui/AppCard';

export default function ReviewDueScreen() {
  const { colors } = useAppColors();
  const [dueIds, setDueIds] = useState<string[]>([]);
  const [started, setStarted] = useState(false);

  const refresh = useCallback(() => {
    const all = allQuizItems().map((q) => q.id);
    void getDueQuizItemIds(all, Date.now()).then(setDueIds);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
      setStarted(false);
    }, [refresh])
  );

  const items = dueIds
    .map((id) => getQuizItem(id))
    .filter((q): q is NonNullable<typeof q> => q != null);

  if (started && items.length > 0) {
    return (
      <QuizRunner
        items={items}
        title="Spaced repetition"
        onDone={() => {
          setStarted(false);
          refresh();
        }}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {items.length === 0 ? (
        <View style={styles.centerCol}>
          <View style={[styles.bigIcon, { backgroundColor: colors.successMuted }]}>
            <FontAwesome name="sun-o" size={44} color={colors.success} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>You are caught up</Text>
          <Text style={[styles.sub, { color: colors.textSecondary }]}>
            Nothing is due for review. Run a topic quiz and rate cards to feed this queue.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.ghost, { borderColor: colors.border, opacity: pressed ? 0.85 : 1 }]}
            onPress={() => refresh()}>
            <Text style={[styles.ghostText, { color: colors.tint }]}>Refresh</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.readyCol}>
          <AppCard colors={colors} accent style={styles.summary}>
            <Text style={[styles.summaryN, { color: colors.tint }]}>{items.length}</Text>
            <Text style={[styles.summaryL, { color: colors.textSecondary }]}>
              question{items.length === 1 ? '' : 's'} waiting in your spaced-repetition queue
            </Text>
          </AppCard>
          <Pressable
            style={({ pressed }) => [
              styles.start,
              { backgroundColor: colors.tint, opacity: pressed ? 0.9 : 1 },
            ]}
            onPress={() => setStarted(true)}>
            <FontAwesome name="play" size={18} color="#fff" style={{ marginRight: 10 }} />
            <Text style={styles.startText}>Start review session</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerCol: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 28 },
  bigIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 10, textAlign: 'center' },
  sub: { fontSize: 15, lineHeight: 23, textAlign: 'center', maxWidth: 300, marginBottom: 24 },
  ghost: { paddingVertical: 12, paddingHorizontal: 22, borderRadius: 12, borderWidth: 1.5 },
  ghostText: { fontWeight: '800', fontSize: 15 },
  readyCol: { flex: 1, padding: 20, paddingTop: 28, justifyContent: 'center' },
  summary: { marginBottom: 24, alignItems: 'center' },
  summaryN: { fontSize: 48, fontWeight: '900', fontVariant: ['tabular-nums'] },
  summaryL: { fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: 8, maxWidth: 280 },
  start: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 17,
    borderRadius: 14,
  },
  startText: { color: '#fff', fontWeight: '800', fontSize: 17 },
});
