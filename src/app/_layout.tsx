import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { StoreProvider } from '@/state/store';
import { usePalette } from '@/theme';

export default function RootLayout() {
  const scheme = useColorScheme();
  const c = usePalette();
  const base = scheme === 'light' ? DefaultTheme : DarkTheme;
  return (
    <StoreProvider>
      <ThemeProvider value={{ ...base, colors: { ...base.colors, primary: c.accent, background: c.bg, card: c.bg, text: c.text, border: c.border } }}>
        <StatusBar style={scheme === 'light' ? 'dark' : 'light'} />
        <Stack
          screenOptions={{
            headerShadowVisible: false,
            headerStyle: { backgroundColor: c.bg },
            headerTintColor: c.text,
            headerTitleStyle: { fontWeight: '700' },
            contentStyle: { backgroundColor: c.bg },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="command/[id]" options={{ title: '', headerBackTitle: 'Back' }} />
        </Stack>
      </ThemeProvider>
    </StoreProvider>
  );
}
