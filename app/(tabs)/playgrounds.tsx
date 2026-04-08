import type { ComponentProps } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { SIMULATORS } from '@/data/corpus';
import { useAppColors } from '@/hooks/useAppColors';
import { AppCard } from '@/components/ui/AppCard';

type FaName = ComponentProps<typeof FontAwesome>['name'];

const ICONS: Record<string, FaName> = {
  'spring-damper': 'sliders',
  'second-order-step': 'area-chart',
  'first-order-tau': 'clock-o',
  'moment-arm': 'wrench',
  'ohms-law': 'flash',
  'continuity-flow': 'arrows-h',
  'present-worth': 'usd',
};

export default function PlaygroundsScreen() {
  const router = useRouter();
  const { colors } = useAppColors();

  const header = (
    <View style={styles.hero}>
      <Text style={[styles.headline, { color: colors.text }]}>Interactive labs</Text>
      <Text style={[styles.sub, { color: colors.textSecondary }]}>
        Sliders drive live plots and (on device) haptics—built to connect handbook math to physical
        intuition, especially dynamics and controls.
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={SIMULATORS}
        keyExtractor={(s) => s.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={header}
        renderItem={({ item }) => {
          const icon = ICONS[item.id] ?? 'flask';
          return (
            <AppCard colors={colors} onPress={() => router.push(`/sim/${item.id}`)} style={styles.cardMargin}>
              <View style={styles.row}>
                <View style={[styles.iconWrap, { backgroundColor: colors.heroOverlay }]}>
                  <FontAwesome name={icon} size={22} color={colors.tint} />
                </View>
                <View style={styles.textCol}>
                  <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
                  <Text style={[styles.desc, { color: colors.textSecondary }]}>{item.description}</Text>
                </View>
                <FontAwesome name="chevron-right" size={14} color={colors.textMuted} />
              </View>
            </AppCard>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  hero: { marginBottom: 18 },
  headline: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3, marginBottom: 8 },
  sub: { fontSize: 15, lineHeight: 22 },
  cardMargin: { marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: { flex: 1 },
  title: { fontSize: 17, fontWeight: '800', marginBottom: 6 },
  desc: { fontSize: 14, lineHeight: 20 },
});
