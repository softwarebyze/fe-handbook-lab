import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { HANDBOOK_SECTIONS } from '@/data/handbookSections';
import { getContentStats } from '@/data/corpus';
import { useAppColors } from '@/hooks/useAppColors';
import { AppCard } from '@/components/ui/AppCard';

export default function LearnScreen() {
  const router = useRouter();
  const { colors } = useAppColors();
  const [query, setQuery] = useState('');

  const stats = useMemo(() => getContentStats(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return HANDBOOK_SECTIONS;
    return HANDBOOK_SECTIONS.filter(
      (s) => s.title.toLowerCase().includes(q) || s.id.replace(/-/g, ' ').includes(q)
    );
  }, [query]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.hero}>
        <Text style={[styles.kicker, { color: colors.tint }]}>FE Handbook Lab</Text>
        <Text style={[styles.headline, { color: colors.text }]}>
          Learn by section. Practice with intent.
        </Text>
        <Text style={[styles.sub, { color: colors.textSecondary }]}>
          Original lessons & simulations keyed to the handbook TOC—open your licensed NCEES PDF for
          official tables (toolbar icon).
        </Text>
        <View style={styles.statRow}>
          <View style={[styles.stat, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statN, { color: colors.tint }]}>{stats.topicCount}</Text>
            <Text style={[styles.statL, { color: colors.textMuted }]}>topics</Text>
          </View>
          <View style={[styles.stat, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statN, { color: colors.tint }]}>{stats.questionCount}</Text>
            <Text style={[styles.statL, { color: colors.textMuted }]}>questions</Text>
          </View>
          <View style={[styles.stat, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statN, { color: colors.tint }]}>{stats.simulatorCount}</Text>
            <Text style={[styles.statL, { color: colors.textMuted }]}>labs</Text>
          </View>
        </View>
      </View>

      <View style={[styles.searchWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <FontAwesome name="search" size={16} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={[styles.search, { color: colors.text }]}
          placeholder="Filter sections…"
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
        {query.length > 0 ? (
          <Pressable onPress={() => setQuery('')} hitSlop={12}>
            <FontAwesome name="times-circle" size={18} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(s) => s.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textMuted }]}>No sections match “{query}”.</Text>
        }
        renderItem={({ item }) => (
          <AppCard
            colors={colors}
            onPress={() => router.push(`/section/${item.id}`)}
            style={styles.cardMargin}>
            <View style={styles.rowInner}>
              <View style={styles.rowText}>
                <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.page, { color: colors.textMuted }]}>Handbook ~p. {item.pageHint}</Text>
              </View>
              <View style={[styles.chev, { backgroundColor: colors.heroOverlay }]}>
                <FontAwesome name="chevron-right" size={14} color={colors.tint} />
              </View>
            </View>
          </AppCard>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { paddingHorizontal: 20, paddingBottom: 12, paddingTop: 8 },
  kicker: { fontSize: 12, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6 },
  headline: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5, lineHeight: 32, marginBottom: 8 },
  sub: { fontSize: 15, lineHeight: 22, marginBottom: 16 },
  statRow: { flexDirection: 'row', gap: 10 },
  stat: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  statN: { fontSize: 20, fontWeight: '800', fontVariant: ['tabular-nums'] },
  statL: { fontSize: 11, fontWeight: '700', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  searchIcon: { marginRight: 10 },
  search: { flex: 1, fontSize: 16, paddingVertical: 4 },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  cardMargin: { marginBottom: 10, paddingVertical: 4 },
  rowInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowText: { flex: 1, paddingRight: 12 },
  title: { fontSize: 16, fontWeight: '700' },
  page: { fontSize: 13, marginTop: 4, fontVariant: ['tabular-nums'] },
  chev: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  empty: { textAlign: 'center', padding: 24, fontSize: 15 },
});
