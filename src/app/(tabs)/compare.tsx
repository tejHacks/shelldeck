import { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Chip } from '@/components/ui';
import { shellById, type ShellId } from '@/data/commands';
import { compareRows, type CompareRow } from '@/data/compare';
import { mono, radius, useIsLight, usePalette } from '@/theme';

const COMPARE_SHELLS: Exclude<ShellId, 'linux'>[] = ['bash', 'zsh', 'fish', 'csh'];

export default function CompareScreen() {
  const c = usePalette();
  const light = useIsLight();
  const [shown, setShown] = useState<Exclude<ShellId, 'linux'>[]>(COMPARE_SHELLS);

  const toggle = (s: Exclude<ShellId, 'linux'>) =>
    setShown((cur) => (cur.includes(s) ? (cur.length > 1 ? cur.filter((x) => x !== s) : cur) : COMPARE_SHELLS.filter((x) => x === s || cur.includes(x))));

  const renderItem = ({ item }: { item: CompareRow }) => (
    <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
      <Text style={[styles.task, { color: c.text }]}>{item.task}</Text>
      {shown.map((s) => (
        <View key={s} style={styles.line}>
          <Text style={[styles.shell, { color: (light ? shellById[s].colorOnLight : shellById[s].color) }]}>{shellById[s].label}</Text>
          <Text selectable style={[styles.code, { color: c.text, backgroundColor: c.bg }]}>
            {item[s]}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <FlatList
      data={compareRows}
      keyExtractor={(r) => r.task}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={{ gap: 10, marginBottom: 6 }}>
          <Text style={[styles.intro, { color: c.muted }]}>The same everyday job in each shell. Tap a shell to hide or show it.</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {COMPARE_SHELLS.map((s) => (
              <Chip key={s} label={shellById[s].label} color={(light ? shellById[s].colorOnLight : shellById[s].color)} active={shown.includes(s)} onPress={() => toggle(s)} />
            ))}
          </ScrollView>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 12, paddingBottom: 40 },
  intro: { fontSize: 14, lineHeight: 20 },
  card: { borderWidth: 1, borderRadius: radius.lg, padding: 14, gap: 8 },
  task: { fontSize: 16, fontWeight: '800', marginBottom: 2 },
  line: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  shell: { width: 64, fontSize: 12, fontWeight: '800', paddingTop: 7 },
  code: { flex: 1, fontFamily: mono, fontSize: 13, lineHeight: 19, paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.sm, overflow: 'hidden' },
});
