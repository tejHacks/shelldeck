import { Platform, useColorScheme } from 'react-native';

const palettes = {
  light: {
    bg: '#F6F7F9',
    card: '#FFFFFF',
    code: '#0F172A',
    codeText: '#E2E8F0',
    border: '#E2E8F0',
    text: '#0F172A',
    muted: '#475569',
    subtle: '#94A3B8',
    accent: '#16A34A',
    accentSoft: '#DCFCE7',
    danger: '#DC2626',
    dangerSoft: '#FEE2E2',
  },
  dark: {
    bg: '#0B0E11',
    card: '#14181D',
    code: '#06080A',
    codeText: '#D1FAE5',
    border: '#232A31',
    text: '#E6EDF3',
    muted: '#9BA7B4',
    subtle: '#5F6B78',
    accent: '#4ADE80',
    accentSoft: '#12301E',
    danger: '#F87171',
    dangerSoft: '#3A1517',
  },
} as const;

export type Palette = Record<keyof (typeof palettes)['light'], string>;

export function useIsLight(): boolean {
  return useColorScheme() === 'light';
}

export function usePalette(): Palette {
  return useColorScheme() === 'light' ? palettes.light : palettes.dark;
}

export const mono = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' });

export const radius = { sm: 8, md: 12, lg: 18, pill: 999 } as const;
