import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import { usePalette } from '@/theme';

type IconName = keyof typeof Ionicons.glyphMap;

const tab = (title: string, icon: IconName, iconActive: IconName) => ({
  title,
  tabBarIcon: ({ color, focused }: { color: ColorValue; focused: boolean }) => (
    <Ionicons name={focused ? iconActive : icon} size={22} color={typeof color === 'string' ? color : undefined} />
  ),
});

export default function TabsLayout() {
  const c = usePalette();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: c.accent,
        tabBarInactiveTintColor: c.subtle,
        tabBarStyle: { backgroundColor: c.bg, borderTopColor: c.border },
        headerStyle: { backgroundColor: c.bg },
        headerShadowVisible: false,
        headerTintColor: c.text,
        headerTitleStyle: { fontWeight: '800' },
        sceneStyle: { backgroundColor: c.bg },
      }}>
      <Tabs.Screen name="index" options={{ ...tab('Commands', 'terminal-outline', 'terminal'), headerTitle: 'ShellDeck' }} />
      <Tabs.Screen name="compare" options={tab('Compare', 'git-compare-outline', 'git-compare')} />
      <Tabs.Screen name="saved" options={tab('Saved', 'bookmark-outline', 'bookmark')} />
      <Tabs.Screen name="about" options={tab('About', 'speedometer-outline', 'speedometer')} />
    </Tabs>
  );
}
