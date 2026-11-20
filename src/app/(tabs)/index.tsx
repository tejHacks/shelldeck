import Ionicons from '@expo/vector-icons/Ionicons';
import { useDeferredValue, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Chip, CommandRow, Empty, ROW_HEIGHT } from '@/components/ui';
import { categoriesFor, commands, shells, type Command, type ShellId } from '@/data/commands';
import { search } from '@/lib/search';
import { mono, radius, useIsLight, usePalette } from '@/theme';

const getItemLayout = (_: ArrayLike<Command> | null | undefined, index: number) => ({ length: ROW_HEIGHT, offset: ROW_HEIGHT * index, index });
const keyOf = (c: Command) => c.id;
const renderItem = ({ item }: { item: Command }) => <CommandRow cmd={item} />;

export default function CommandsScreen() {
  const c = usePalette();
  const light = useIsLight();
  const [query, setQuery] = useState('');
  const [shell, setShell] = useState<ShellId | 'all'>('all');
  const [category, setCategory] = useState<string | null>(null);
  const deferred = useDeferredValue(query);
  const listRef = useRef<FlatList<Command>>(null);

  const categories = useMemo(() => categoriesFor(shell), [shell]);
  const result = useMemo(() => search(commands, deferred, { shell, category }), [deferred, shell, category]);

  const pickShell = (s: ShellId | 'all') => {
    setShell(s);
    setCategory(null);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  };
  const pickCategory = (cat: string | null) => {
    setCategory(cat);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.top}>
        <View style={[styles.search, { backgroundColor: c.card, borderColor: c.border }]}>
          <Ionicons name="search" size={18} color={c.subtle} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={`Search ${commands.length} commands…`}
            placeholderTextColor={c.subtle}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            clearButtonMode="never"
            returnKeyType="search"
            style={[styles.input, { color: c.text }]}
            accessibilityLabel="Search commands"
          />
          {query ? (
            <Pressable accessibilityRole="button" accessibilityLabel="Clear search" hitSlop={10} onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={c.subtle} />
            </Pressable>
          ) : null}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} keyboardShouldPersistTaps="handled">
          <Chip label="All" active={shell === 'all'} onPress={() => pickShell('all')} />
          {shells.map((s) => (
            <Chip key={s.id} label={s.label} color={light ? s.colorOnLight : s.color} active={shell === s.id} onPress={() => pickShell(s.id)} />
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} keyboardShouldPersistTaps="handled">
          <Chip label="Every category" active={category === null} onPress={() => pickCategory(null)} />
          {categories.map((cat) => (
            <Chip key={cat} label={cat} active={category === cat} onPress={() => pickCategory(category === cat ? null : cat)} />
          ))}
        </ScrollView>
        <Text style={[styles.stat, { color: c.subtle }]} accessibilityLiveRegion="polite">
          {result.items.length} {result.items.length === 1 ? 'result' : 'results'} in {result.ms < 0.01 ? '<0.01' : result.ms.toFixed(2)} ms
        </Text>
      </View>
      <FlatList
        ref={listRef}
        data={result.items}
        keyExtractor={keyOf}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        initialNumToRender={14}
        maxToRenderPerBatch={20}
        windowSize={9}
        removeClippedSubviews
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListEmptyComponent={<Empty icon="search" title="No commands found" body="Try fewer words, or search for what you want to do, like “disk space” or “rename files”." />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  top: { paddingTop: 8, gap: 8, paddingBottom: 6 },
  search: {
    marginHorizontal: 16,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  input: { flex: 1, fontSize: 16, fontFamily: mono, paddingVertical: 0 },
  chips: { paddingHorizontal: 16, gap: 8 },
  stat: { paddingHorizontal: 16, fontSize: 12, fontFamily: mono },
});
