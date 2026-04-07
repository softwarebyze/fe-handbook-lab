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

import { FormulaCardBody } from '@/components/formula/FormulaCardBody';
import { AppCard } from '@/components/ui/AppCard';
import { getAllFormulaCards } from '@/data/corpus';
import { useAppColors } from '@/hooks/useAppColors';
import { SectionHeading } from '@/components/ui/SectionHeading';

export default function ReferenceScreen() {
  const router = useRouter();
  const { colors } = useAppColors();
  const [q, setQ] = useState('');

  const cards = useMemo(() => {
    const all = getAllFormulaCards();
    const s = q.trim().toLowerCase();
    if (!s) return all;
    return all.filter(
      (f) =>
        f.title.toLowerCase().includes(s) ||
        f.expression.toLowerCase().includes(s) ||
        f.handbookSection.toLowerCase().includes(s)
    );
  }, [q]);

  const header = (
    <View style={styles.headerBlock}>
      <Text style={[styles.intro, { color: colors.textSecondary }]}>
        Original formula cards for quick recall. Tap a card to open its topic lesson.
      </Text>
      <View style={[styles.searchWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <FontAwesome name="search" size={16} color={colors.textMuted} style={{ marginRight: 10 }} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Search expressions, titles, sections…"
          placeholderTextColor={colors.textMuted}
          value={q}
          onChangeText={setQ}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {q.length > 0 ? (
          <Pressable onPress={() => setQ('')} hitSlop={12}>
            <FontAwesome name="times-circle" size={18} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      <SectionHeading title="Results" colors={colors} right={`${cards.length}`} />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={cards}
        keyExtractor={(f) => f.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={header}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textMuted }]}>No formulas match your search.</Text>
        }
        renderItem={({ item }) => (
          <AppCard colors={colors} onPress={() => router.push(`/topic/${item.topicId}`)} style={styles.cardMargin}>
            <FormulaCardBody card={item} />
            <Text style={[styles.meta, { color: colors.textMuted, marginTop: 10 }]}>{item.handbookSection}</Text>
          </AppCard>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  headerBlock: { marginBottom: 8 },
  intro: { fontSize: 14, lineHeight: 21, marginBottom: 14 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  input: { flex: 1, fontSize: 16, paddingVertical: 4 },
  cardMargin: { marginBottom: 10 },
  meta: { fontSize: 12, fontWeight: '600' },
  empty: { textAlign: 'center', padding: 28, fontSize: 15 },
});
