import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { buildKaTeXDocument } from '@/lib/katexHtml';

export type MathBlockProps = {
  latex: string;
  /** Block (centered) vs tighter inline-style layout */
  display?: boolean;
  textColor: string;
  mathBackground: string;
  minHeight?: number;
};

export function MathBlock({
  latex,
  display = true,
  textColor,
  mathBackground,
  minHeight = 44,
}: MathBlockProps) {
  const html = useMemo(
    () => buildKaTeXDocument(latex, display, textColor, mathBackground),
    [latex, display, textColor, mathBackground]
  );

  const [h, setH] = useState(display ? 72 : 52);

  const onMessage = useCallback(
    (e: { nativeEvent: { data: string } }) => {
      const n = parseInt(e.nativeEvent.data, 10);
      if (!Number.isFinite(n) || n < 20) return;
      setH(Math.max(minHeight, Math.min(n + 8, 420)));
    },
    [minHeight]
  );

  return (
    <View style={[styles.wrap, display && styles.wrapDisplay, { minHeight: h }]}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        onMessage={onMessage}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={[styles.web, { height: h }]}
        androidLayerType="hardware"
        setBuiltInZoomControls={false}
        automaticallyAdjustContentInsets={false}
        mixedContentMode="always"
        containerStyle={styles.webContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  wrapDisplay: {
    marginVertical: 6,
  },
  web: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  webContainer: {
    backgroundColor: 'transparent',
  },
});
