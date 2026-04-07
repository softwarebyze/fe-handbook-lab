import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { getSectionById } from '@/data/handbookSections';
import { getTopicsForSection } from '@/data/corpus';
import { useAppColors } from '@/hooks/useAppColors';
import { AppCard } from '@/components/ui/AppCard';

export default function SectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useAppColors();

  const section = id ? getSectionById(id) : undefined;
  const topics = id ? getTopicsForSection(id) : [];

  if (!section) {
    return (
      <>
        <Stack.Screen options={{ title: 'Section' }} />
        <View style={[styles.center, { backgroundColor: colors.background }]}>
          <Text style={{ color: colors.textSecondary }}>Unknown section.</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: section.title }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.metaCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Handbook reference</Text>
          <Text style={[styles.metaVal, { color: colors.text }]}>
            ~page {section.pageHint} · {topics.length} topic{topics.length === 1 ? '' : 's'}
          </Text>
        </View>
        <FlatList
          data={topics}
          keyExtractor={(t) => t.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: colors.textMuted }]}>
              No topics yet—add content in the corpus for this section.
            </Text>
          }
          renderItem={({ item }) => (
            <AppCard colors={colors} onPress={() => router.push(`/topic/${item.id}`)} style={styles.cardMargin}>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
                  <Text style={[styles.cardSub, { color: colors.textMuted }]}>{item.handbookSection}</Text>
                </View>
                <View style={[styles.chev, { backgroundColor: colors.heroOverlay }]}>
                  <FontAwesome name="chevron-right" size={14} color={colors.tint} />
                </View>
              </View>
            </AppCard>
          )}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  metaCard: {
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  metaLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 },
  metaVal: { fontSize: 15, fontWeight: '700', fontVariant: ['tabular-nums'] },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  cardMargin: { marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardSub: { fontSize: 13, marginTop: 4 },
  chev: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  empty: { padding: 24, textAlign: 'center', fontSize: 15, lineHeight: 22 },
});
