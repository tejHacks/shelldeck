import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CommandRow, Empty, SectionTitle } from '@/components/ui';
import { commandById } from '@/data/commands';
import { useStore } from '@/state/store';
import { usePalette } from '@/theme';

export default function SavedScreen() {
  const c = usePalette();
  const { saved, recent, clearRecent } = useStore();
  const savedCmds = saved.map((id) => commandById[id]).filter(Boolean);
  const recentCmds = recent.map((id) => commandById[id]).filter(Boolean);

  if (!savedCmds.length && !recentCmds.length) {
    return <Empty icon="bookmark-outline" title="Nothing saved yet" body="Open a command and tap the bookmark to keep it here. Commands you view also show up here." />;
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.pad}>
        <SectionTitle>{`Saved (${savedCmds.length})`}</SectionTitle>
      </View>
      {savedCmds.length ? (
        savedCmds.map((cmd) => <CommandRow key={cmd.id} cmd={cmd} />)
      ) : (
        <Text style={[styles.hint, { color: c.muted }]}>Tap the bookmark on any command to save it.</Text>
      )}
      {recentCmds.length > 0 && (
        <>
          <View style={[styles.pad, styles.head]}>
            <SectionTitle>Recently viewed</SectionTitle>
            <Pressable accessibilityRole="button" onPress={clearRecent} hitSlop={10}>
              <Text style={[styles.clear, { color: c.accent }]}>Clear</Text>
            </Pressable>
          </View>
          {recentCmds.map((cmd) => (
            <CommandRow key={cmd.id} cmd={cmd} />
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: 16 },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  clear: { fontWeight: '700', marginTop: 12 },
  hint: { paddingHorizontal: 16, fontSize: 14 },
});
