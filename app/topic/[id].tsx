import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FormulaCardBody } from '@/components/formula/FormulaCardBody';
import { LessonRenderer } from '@/components/lesson/LessonRenderer';
import { AppCard } from '@/components/ui/AppCard';
import { getFormulaCard, getSimulatorMeta, getTopic } from '@/data/corpus';
import { useAppColors } from '@/hooks/useAppColors';

export default function TopicScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useAppColors();

  const topic = id ? getTopic(id) : undefined;

  if (!topic) {
    return (
      <>
        <Stack.Screen options={{ title: 'Topic' }} />
        <View style={[styles.center, { backgroundColor: colors.background }]}>
          <Text style={{ color: colors.textSecondary }}>Topic not found.</Text>
        </View>
      </>
    );
  }

  const legacyParagraphs = topic.lesson.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  const richLesson = topic.lessonBlocks && topic.lessonBlocks.length > 0;

  return (
    <>
      <Stack.Screen options={{ title: topic.title }} />
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.pill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <FontAwesome name="bookmark" size={12} color={colors.tint} style={{ marginRight: 6 }} />
          <Text style={[styles.pillText, { color: colors.textSecondary }]}>
            {topic.handbookSection}
            {topic.pageHint != null ? ` · ~p. ${topic.pageHint}` : ''}
          </Text>
        </View>

        <Text style={[styles.h2, { color: colors.text }]}>Objectives</Text>
        <View style={styles.objWrap}>
          {topic.learningObjectives.map((o, i) => (
            <View key={i} style={[styles.objChip, { backgroundColor: colors.heroOverlay, borderColor: colors.border }]}>
              <Text style={[styles.objText, { color: colors.text }]}>{o}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.h2, { color: colors.text }]}>Lesson</Text>
        {richLesson ? (
          <LessonRenderer blocks={topic.lessonBlocks!} />
        ) : (
          legacyParagraphs.map((p, i) => (
            <Text key={i} style={[styles.para, { color: colors.textSecondary }]}>
              {p}
            </Text>
          ))
        )}

        {topic.formulaCardIds.length > 0 ? (
          <>
            <Text style={[styles.h2, { color: colors.text }]}>Formula cards</Text>
            {topic.formulaCardIds.map((fid) => {
              const f = getFormulaCard(fid);
              if (!f) return null;
              return (
                <AppCard key={fid} colors={colors} style={styles.formulaCard}>
                  <FormulaCardBody card={f} />
                </AppCard>
              );
            })}
          </>
        ) : null}

        <Text style={[styles.h2, { color: colors.text }]}>Next steps</Text>
        <View style={styles.actions}>
          {topic.quizItemIds.length > 0 ? (
            <Pressable
              style={({ pressed }) => [
                styles.btn,
                { backgroundColor: colors.tint, opacity: pressed ? 0.92 : 1 },
              ]}
              onPress={() => router.push(`/quiz/${topic.id}`)}>
              <FontAwesome name="pencil" size={18} color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.btnText}>Practice quiz · {topic.quizItemIds.length} Q</Text>
            </Pressable>
          ) : null}
          {topic.simulatorIds.map((sid) => {
            const meta = getSimulatorMeta(sid);
            return (
              <Pressable
                key={sid}
                style={({ pressed }) => [
                  styles.btnOutline,
                  { borderColor: colors.tint, opacity: pressed ? 0.9 : 1 },
                ]}
                onPress={() => router.push(`/sim/${sid}`)}>
                <FontAwesome name="flask" size={17} color={colors.tint} style={{ marginRight: 10 }} />
                <Text style={[styles.btnOutlineText, { color: colors.tint }]}>
                  Lab · {meta?.title ?? sid}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 18, paddingBottom: 56 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  pillText: { fontSize: 12, fontWeight: '700' },
  h2: { fontSize: 13, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 22, marginBottom: 12 },
  objWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  objChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    maxWidth: '100%',
  },
  objText: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
  para: { fontSize: 16, lineHeight: 26, marginBottom: 14 },
  formulaCard: { marginBottom: 10 },
  actions: { marginTop: 8, gap: 12 },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 14,
  },
  btnText: { color: '#fff', fontWeight: '800', textAlign: 'center', fontSize: 16 },
  btnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 14,
    borderWidth: 2,
  },
  btnOutlineText: { fontWeight: '800', textAlign: 'center', fontSize: 15 },
});
