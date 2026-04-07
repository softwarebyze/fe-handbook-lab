import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { SimView } from '@/components/sim/SimView';
import { getSimulatorMeta } from '@/data/corpus';
import { useAppColors } from '@/hooks/useAppColors';

export default function SimScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useAppColors();

  const meta = id ? getSimulatorMeta(id) : undefined;

  if (!meta) {
    return (
      <>
        <Stack.Screen options={{ title: 'Playground' }} />
        <View style={[styles.center, { backgroundColor: colors.background }]}>
          <Text style={{ color: colors.textSecondary }}>Simulator not found.</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: meta.title }} />
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.banner, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.desc, { color: colors.textSecondary }]}>{meta.description}</Text>
        </View>
        <SimView simId={meta.id} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 48 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  banner: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  desc: { fontSize: 15, lineHeight: 23, fontWeight: '500' },
});
