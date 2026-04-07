import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, Platform, View } from 'react-native';

import { useAppColors } from '@/hooks/useAppColors';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={22} style={{ marginBottom: -1 }} {...props} />;
}

export default function TabLayout() {
  const { colors } = useAppColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
          paddingTop: 6,
          paddingBottom: Platform.OS === 'ios' ? 22 : 10,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', letterSpacing: 0.2 },
        tabBarHideOnKeyboard: true,
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { color: colors.text, fontWeight: '800', fontSize: 18 },
        headerTintColor: colors.tint,
        headerShadowVisible: false,
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8 }}>
              <Link href="/modal" asChild>
                <Pressable style={{ padding: 8 }} accessibilityLabel="About this app">
                  {({ pressed }) => (
                    <FontAwesome
                      name="info-circle"
                      size={22}
                      color={colors.textMuted}
                      style={{ opacity: pressed ? 0.55 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
              <Link href="/handbook" asChild>
                <Pressable style={{ padding: 8 }} accessibilityLabel="Official handbook">
                  {({ pressed }) => (
                    <FontAwesome
                      name="file-pdf-o"
                      size={21}
                      color={colors.tint}
                      style={{ opacity: pressed ? 0.55 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: 'Practice',
          tabBarIcon: ({ color }) => <TabBarIcon name="graduation-cap" color={color} />,
        }}
      />
      <Tabs.Screen
        name="reference"
        options={{
          title: 'Reference',
          tabBarIcon: ({ color }) => <TabBarIcon name="superscript" color={color} />,
        }}
      />
      <Tabs.Screen
        name="playgrounds"
        options={{
          title: 'Labs',
          tabBarIcon: ({ color }) => <TabBarIcon name="flask" color={color} />,
        }}
      />
    </Tabs>
  );
}
