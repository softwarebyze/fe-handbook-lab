import 'react-native-gesture-handler';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavDefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import 'react-native-reanimated';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const c = Colors[isDark ? 'dark' : 'light'];

  const navigationTheme = useMemo(
    () => ({
      ...(isDark ? NavDarkTheme : NavDefaultTheme),
      colors: {
        ...(isDark ? NavDarkTheme : NavDefaultTheme).colors,
        primary: c.tint,
        background: c.background,
        card: c.surface,
        text: c.text,
        border: c.border,
        notification: c.tint,
      },
    }),
    [isDark, c]
  );

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: c.surface },
          headerTintColor: c.tint,
          headerTitleStyle: {
            color: c.text,
            fontWeight: '700',
            fontSize: 17,
          },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: c.background },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'About' }} />
        <Stack.Screen name="handbook" options={{ title: 'Official handbook' }} />
        <Stack.Screen name="section/[id]" options={{ title: 'Section' }} />
        <Stack.Screen name="topic/[id]" options={{ title: 'Topic' }} />
        <Stack.Screen name="quiz/[topicId]" options={{ title: 'Practice' }} />
        <Stack.Screen name="sim/[id]" options={{ title: 'Playground' }} />
        <Stack.Screen name="review-due" options={{ title: 'Due reviews' }} />
      </Stack>
    </ThemeProvider>
  );
}
