import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CodeLine, Empty, SectionTitle, ShellBadge } from '@/components/ui';
import { commandById, commands } from '@/data/commands';
import { useStore } from '@/state/store';
import { mono, radius, usePalette } from '@/theme';

export default function CommandScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const cmd = commandById[id ?? ''];
  const c = usePalette();
  const { isSaved, toggleSaved, addRecent } = useStore();

  useEffect(() => {
    if (cmd) addRecent(cmd.id);
  }, [cmd, addRecent]);

  const related = useMemo(
    () => (cmd ? commands.filter((x) => x.shell === cmd.shell && x.category === cmd.category && x.id !== cmd.id).slice(0, 8) : []),
    [cmd],
  );

  if (!cmd) return <Empty icon="help-circle-outline" title="Command not found" body="It may have been renamed in an update." />;
  const saved = isSaved(cmd.id);

  return (
    <>
      <Stack.Screen
        options={{
          title: cmd.name,
          headerTitleStyle: { fontFamily: mono, fontWeight: '700' },
          headerRight: () => (
            <Pressable accessibilityRole="button" accessibilityLabel={saved ? 'Remove from saved' : 'Save command'} hitSlop={12} onPress={() => toggleSaved(cmd.id)}>
              <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={22} color={saved ? c.accent : c.text} />
            </Pressable>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.meta}>
          <ShellBadge shell={cmd.shell} />
          <Text style={[styles.category, { color: c.subtle }]}>{cmd.category}</Text>
        </View>
        <Text style={[styles.summary, { color: c.text }]}>{cmd.summary}</Text>

        {cmd.danger && (
          <View style={[styles.warn, { backgroundColor: c.dangerSoft }]}>
            <Ionicons name="warning" size={18} color={c.danger} />
            <Text style={[styles.warnText, { color: c.danger }]}>Careful: this can delete data or stop things. Double-check before pressing Enter.</Text>
          </View>
        )}

        <SectionTitle>Syntax</SectionTitle>
        <View style={[styles.syntax, { backgroundColor: c.card, borderColor: c.border }]}>
          <Text selectable style={[styles.syntaxText, { color: c.text }]}>
            {cmd.syntax}
          </Text>
        </View>

        <SectionTitle>{cmd.examples.length === 1 ? 'Example' : `Examples (${cmd.examples.length})`}</SectionTitle>
        <View style={{ gap: 10 }}>
          {cmd.examples.map((e, i) => (
            <CodeLine key={i} code={e.cmd} note={e.desc} />
          ))}
        </View>

        {related.length > 0 && (
          <>
            <SectionTitle>{`More in ${cmd.category}`}</SectionTitle>
            <View style={styles.related}>
              {related.map((r) => (
                <Pressable
                  key={r.id}
                  accessibilityRole="button"
                  onPress={() => router.replace({ pathname: '/command/[id]', params: { id: r.id } })}
                  style={[styles.relatedChip, { backgroundColor: c.card, borderColor: c.border }]}>
                  <Text style={[styles.relatedText, { color: c.text }]}>{r.name}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  body: { padding: 16, paddingBottom: 48 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  category: { fontSize: 13, fontWeight: '600' },
  summary: { fontSize: 20, fontWeight: '700', lineHeight: 27, marginTop: 10 },
  warn: { flexDirection: 'row', gap: 10, padding: 12, borderRadius: radius.md, marginTop: 14, alignItems: 'flex-start' },
  warnText: { flex: 1, fontSize: 14, lineHeight: 20, fontWeight: '600' },
  syntax: { borderWidth: 1, borderRadius: radius.md, padding: 12 },
  syntaxText: { fontFamily: mono, fontSize: 14, lineHeight: 21 },
  related: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  relatedChip: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 7 },
  relatedText: { fontFamily: mono, fontSize: 13, fontWeight: '600' },
});
