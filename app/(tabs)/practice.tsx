import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { TOPICS } from '@/data/corpus';
import { getDueQuizItemIds } from '@/lib/srs';
import { useAppColors } from '@/hooks/useAppColors';
import { AppCard } from '@/components/ui/AppCard';
import { SectionHeading } from '@/components/ui/SectionHeading';

export default function PracticeScreen() {
  const router = useRouter();
  const { colors } = useAppColors();
  const [dueCount, setDueCount] = useState(0);

  const quizTopics = useMemo(() => TOPICS.filter((t) => t.quizItemIds.length > 0), []);

  const refreshDue = useCallback(() => {
    const allIds = quizTopics.flatMap((t) => t.quizItemIds);
    void getDueQuizItemIds(allIds, Date.now()).then((ids) => setDueCount(ids.length));
  }, [quizTopics]);

  useFocusEffect(
    useCallback(() => {
      refreshDue();
    }, [refreshDue])
  );

  const header = (
    <>
      <AppCard colors={colors} accent onPress={() => router.push('/review-due')} style={styles.dueCard}>
        <View style={styles.dueRow}>
          <View style={[styles.dueIcon, { backgroundColor: `${colors.tint}22` }]}>
            <FontAwesome name="bolt" size={22} color={colors.tint} />
          </View>
          <View style={styles.dueText}>
            <Text style={[styles.dueTitle, { color: colors.text }]}>Spaced repetition</Text>
            <Text style={[styles.dueSub, { color: colors.textSecondary }]}>
              {dueCount === 0
                ? 'All caught up — open a topic quiz to add more.'
                : `${dueCount} card${dueCount === 1 ? '' : 's'} ready · tap to review`}
            </Text>
          </View>
          <FontAwesome name="chevron-right" size={16} color={colors.tint} />
        </View>
      </AppCard>
      <View style={styles.sectionHead}>
        <SectionHeading title="Quizzes by topic" colors={colors} right={`${quizTopics.length} topics`} />
      </View>
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={quizTopics}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={header}
        renderItem={({ item }) => (
          <AppCard colors={colors} onPress={() => router.push(`/quiz/${item.id}`)} style={styles.cardMargin}>
            <View style={styles.quizRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.cardMeta, { color: colors.textMuted }]}>{item.handbookSection}</Text>
              </View>
              <View style={[styles.qBadge, { backgroundColor: colors.heroOverlay }]}>
                <Text style={[styles.qBadgeText, { color: colors.tint }]}>{item.quizItemIds.length}</Text>
              </View>
            </View>
          </AppCard>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  dueCard: { marginBottom: 20 },
  dueRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  dueIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  dueText: { flex: 1 },
  dueTitle: { fontSize: 17, fontWeight: '800' },
  dueSub: { fontSize: 14, lineHeight: 20, marginTop: 4 },
  sectionHead: { marginBottom: 6 },
  cardMargin: { marginBottom: 10 },
  quizRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardMeta: { fontSize: 13, marginTop: 4 },
  qBadge: { minWidth: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  qBadgeText: { fontSize: 15, fontWeight: '800', fontVariant: ['tabular-nums'] },
});
