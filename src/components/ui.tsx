import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { memo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { shellById, type Command, type ShellId } from '@/data/commands';
import { mono, radius, useIsLight, usePalette } from '@/theme';

export function Chip({ label, active, color, onPress }: { label: string; active: boolean; color?: string; onPress: () => void }) {
  const c = usePalette();
  const tint = color ?? c.accent;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.chip, { borderColor: active ? tint : c.border, backgroundColor: active ? tint + '22' : c.card }]}>
      <Text style={[styles.chipText, { color: active ? tint : c.muted }]}>{label}</Text>
    </Pressable>
  );
}

export function ShellBadge({ shell }: { shell: ShellId }) {
  const s = shellById[shell];
  const color = useIsLight() ? s.colorOnLight : s.color;
  return (
    <View style={[styles.badge, { backgroundColor: color + '22' }]}>
      <Text style={[styles.badgeText, { color }]}>{s.label}</Text>
    </View>
  );
}

export const ROW_HEIGHT = 68;

/** One command in a list. Fixed height so long lists can skip measuring. */
export const CommandRow = memo(function CommandRow({ cmd }: { cmd: Command }) {
  const c = usePalette();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${cmd.name}: ${cmd.summary}`}
      onPress={() => router.push({ pathname: '/command/[id]', params: { id: cmd.id } })}
      style={({ pressed }) => [styles.row, { borderBottomColor: c.border, backgroundColor: pressed ? c.card : 'transparent' }]}>
      <View style={styles.rowTop}>
        <Text numberOfLines={1} style={[styles.rowName, { color: c.text }]}>
          {cmd.name}
        </Text>
        {cmd.danger && <Ionicons name="warning" size={14} color={c.danger} />}
        <View style={{ flex: 1 }} />
        <ShellBadge shell={cmd.shell} />
      </View>
      <Text numberOfLines={1} style={[styles.rowSummary, { color: c.muted }]}>
        {cmd.summary}
      </Text>
    </Pressable>
  );
});

/** A dark code line with a copy button. */
export function CodeLine({ code, note }: { code: string; note?: string }) {
  const c = usePalette();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await Clipboard.setStringAsync(code);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <View style={[styles.code, { backgroundColor: c.code }]}>
      <View style={styles.codeTop}>
        <Text selectable style={[styles.codeText, { color: c.codeText }]}>
          <Text style={{ color: '#4ADE80' }}>$ </Text>
          {code}
        </Text>
        <Pressable accessibilityRole="button" accessibilityLabel={copied ? 'Copied' : `Copy ${code}`} hitSlop={10} onPress={copy} style={styles.copy}>
          <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={17} color={copied ? '#4ADE80' : '#94A3B8'} />
        </Pressable>
      </View>
      {note ? <Text style={styles.codeNote}>{note}</Text> : null}
    </View>
  );
}

export function SectionTitle({ children }: { children: string }) {
  const c = usePalette();
  return <Text style={[styles.section, { color: c.subtle }]}>{children.toUpperCase()}</Text>;
}

export function Empty({ icon, title, body }: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string }) {
  const c = usePalette();
  return (
    <View style={styles.empty}>
      <Ionicons name={icon} size={40} color={c.subtle} />
      <Text style={[styles.emptyTitle, { color: c.text }]}>{title}</Text>
      <Text style={[styles.emptyBody, { color: c.muted }]}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { paddingHorizontal: 12, height: 32, borderRadius: radius.pill, borderWidth: 1, justifyContent: 'center' },
  chipText: { fontSize: 13, fontWeight: '600' },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill },
  badgeText: { fontSize: 11, fontWeight: '700' },
  row: { height: ROW_HEIGHT, paddingHorizontal: 16, justifyContent: 'center', borderBottomWidth: StyleSheet.hairlineWidth },
  rowTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowName: { fontFamily: mono, fontSize: 15, fontWeight: '700', flexShrink: 1 },
  rowSummary: { fontSize: 13.5, marginTop: 4 },
  code: { borderRadius: radius.md, padding: 12, gap: 6 },
  codeTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  codeText: { fontFamily: mono, fontSize: 13.5, lineHeight: 20, flex: 1 },
  copy: { paddingTop: 1 },
  codeNote: { color: '#94A3B8', fontSize: 13, lineHeight: 18 },
  section: { fontSize: 12, fontWeight: '800', letterSpacing: 0.8, marginTop: 20, marginBottom: 8 },
  empty: { alignItems: 'center', padding: 40, gap: 8 },
  emptyTitle: { fontSize: 17, fontWeight: '700' },
  emptyBody: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
