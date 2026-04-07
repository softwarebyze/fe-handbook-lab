import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as DocumentPicker from 'expo-document-picker';
import * as WebBrowser from 'expo-web-browser';
import {
  Alert,
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { HANDBOOK_SECTIONS, NCEES_HANDBOOK_URL } from '@/data/handbookSections';
import { useAppColors } from '@/hooks/useAppColors';
import { AppCard } from '@/components/ui/AppCard';

export default function HandbookScreen() {
  const { colors } = useAppColors();

  const openNcees = () => {
    void WebBrowser.openBrowserAsync(NCEES_HANDBOOK_URL);
  };

  const pickPdf = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
      if (res.canceled || !res.assets?.[0]) return;
      const uri = res.assets[0].uri;
      const can = await Linking.canOpenURL(uri);
      if (can) await Linking.openURL(uri);
      else Alert.alert('Cannot open file', 'Try opening the PDF from Files after picking it.');
    } catch (e) {
      Alert.alert('Picker error', String(e));
    }
  };

  const header = (
    <View style={styles.header}>
      <Text style={[styles.lead, { color: colors.textSecondary }]}>
        This app never ships the NCEES handbook. Download your personal copy from NCEES, then open it
        in your reader—or pick the file below.
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.primary,
          { backgroundColor: colors.tint, opacity: pressed ? 0.9 : 1 },
        ]}
        onPress={openNcees}>
        <FontAwesome name="external-link" size={18} color="#fff" style={{ marginRight: 10 }} />
        <Text style={styles.primaryText}>NCEES exam prep & handbook</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.secondary,
          { borderColor: colors.tint, opacity: pressed ? 0.88 : 1 },
        ]}
        onPress={() => void pickPdf()}>
        <FontAwesome name="folder-open" size={18} color={colors.tint} style={{ marginRight: 10 }} />
        <Text style={[styles.secondaryText, { color: colors.tint }]}>Open a PDF from this device</Text>
      </Pressable>

      <Text style={[styles.h2, { color: colors.text }]}>Section map (10.0.1 page hints)</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        style={{ flex: 1 }}
        data={HANDBOOK_SECTIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={header}
        renderItem={({ item }) => (
          <AppCard colors={colors} style={styles.rowCard}>
            <View style={styles.rowInner}>
              <Text style={[styles.rowTitle, { color: colors.text }]}>{item.title}</Text>
              <View style={[styles.pagePill, { backgroundColor: colors.heroOverlay }]}>
                <Text style={[styles.page, { color: colors.tint }]}>p. {item.pageHint}</Text>
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
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  header: { marginBottom: 8, paddingTop: 4 },
  lead: { fontSize: 15, lineHeight: 23, marginBottom: 18 },
  h2: { fontSize: 13, fontWeight: '800', letterSpacing: 0.7, textTransform: 'uppercase', marginTop: 8, marginBottom: 12 },
  primary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  primaryText: { color: '#fff', fontWeight: '800', textAlign: 'center', fontSize: 16 },
  secondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 14,
    borderWidth: 2,
    marginBottom: 22,
  },
  secondaryText: { fontWeight: '800', textAlign: 'center', fontSize: 15 },
  rowCard: { marginBottom: 8, paddingVertical: 12 },
  rowInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  rowTitle: { fontSize: 15, fontWeight: '700', flex: 1 },
  pagePill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  page: { fontSize: 13, fontWeight: '800', fontVariant: ['tabular-nums'] },
});
