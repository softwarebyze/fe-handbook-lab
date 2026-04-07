import type { ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import type { AppColors } from '@/constants/Colors';

type Props = {
  children: ReactNode;
  colors: AppColors;
  onPress?: () => void;
  style?: ViewStyle;
  /** Extra highlight (e.g. due-review CTA). */
  accent?: boolean;
};

export function AppCard({ children, colors, onPress, style, accent }: Props) {
  const base = [
    styles.card,
    {
      backgroundColor: accent ? colors.heroOverlay : colors.surface,
      borderColor: accent ? colors.tint : colors.border,
      borderWidth: accent ? 1.5 : 1,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        android: { elevation: 2 },
        default: {},
      }),
    },
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [...base, pressed && { opacity: 0.92, transform: [{ scale: 0.992 }] }]}
        onPress={onPress}
        android_ripple={{ color: `${colors.tint}33` }}>
        {children}
      </Pressable>
    );
  }

  return <View style={base}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 16,
    overflow: 'hidden',
  },
});
