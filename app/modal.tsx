import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';
import { Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { NCEES_HANDBOOK_URL } from '@/data/handbookSections';
import { useAppColors } from '@/hooks/useAppColors';

export default function ModalScreen() {
  const { colors, isDark } = useAppColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.iconCircle, { backgroundColor: colors.heroOverlay }]}>
        <FontAwesome name="graduation-cap" size={36} color={colors.tint} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>FE Handbook Lab</Text>
      <Text style={[styles.body, { color: colors.textSecondary }]}>
        Original lessons, quizzes, and interactive labs organized like the FE Reference Handbook table
        of contents. NCEES material is not redistributed—obtain your PDF from the source below.
      </Text>
      <Pressable
        style={({ pressed }) => [styles.linkBtn, { borderColor: colors.tint, opacity: pressed ? 0.88 : 1 }]}
        onPress={() => void Linking.openURL(NCEES_HANDBOOK_URL)}>
        <FontAwesome name="external-link" size={16} color={colors.tint} style={{ marginRight: 8 }} />
        <Text style={[styles.linkText, { color: colors.tint }]}>ncees.org — exam prep</Text>
      </Pressable>
      <StatusBar style={isDark ? 'light' : Platform.OS === 'ios' ? 'dark' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 12, letterSpacing: -0.3 },
  body: { fontSize: 15, lineHeight: 24, textAlign: 'center', marginBottom: 24, maxWidth: 320 },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 2,
  },
  linkText: { fontWeight: '800', fontSize: 15 },
});
