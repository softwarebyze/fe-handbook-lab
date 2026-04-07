import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { QuizRunner } from '@/components/QuizRunner';
import { getQuizItem, getTopic } from '@/data/corpus';
import { useAppColors } from '@/hooks/useAppColors';

export default function QuizTopicScreen() {
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  const { colors } = useAppColors();

  const topic = topicId ? getTopic(topicId) : undefined;
  const items =
    topic?.quizItemIds
      .map((id) => getQuizItem(id))
      .filter((q): q is NonNullable<typeof q> => q != null) ?? [];

  if (!topic || items.length === 0) {
    return (
      <>
        <Stack.Screen options={{ title: 'Practice' }} />
        <View style={[styles.empty, { backgroundColor: colors.background }]}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No questions for this topic yet. Add quiz items in the content corpus.
          </Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: topic.title }} />
      <QuizRunner items={items} title={topic.title} />
    </>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, justifyContent: 'center', padding: 28 },
  emptyText: { textAlign: 'center', fontSize: 16, lineHeight: 24 },
});
