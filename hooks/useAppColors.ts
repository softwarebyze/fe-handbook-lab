import Colors, { type AppColors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export function useAppColors(): { colors: AppColors; scheme: 'light' | 'dark'; isDark: boolean } {
  const raw = useColorScheme();
  const scheme = raw === 'dark' ? 'dark' : 'light';
  return {
    colors: Colors[scheme],
    scheme,
    isDark: scheme === 'dark',
  };
}
