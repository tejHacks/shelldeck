import Ionicons from '@expo/vector-icons/Ionicons';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SectionTitle } from '@/components/ui';
import { commands, parseMs, shells, totalExamples } from '@/data/commands';
import { compareRows } from '@/data/compare';
import { search } from '@/lib/search';
import { mono, radius, usePalette } from '@/theme';

const REPO_URL = 'https://github.com/tejHacks/shelldeck';

const BENCH_QUERIES = ['ls', 'git', 'disk', 'loop', 'copy file', 'network port', 'fish', 'variable', 'compress', 'kill process', 'zz', 'a'];
const BENCH_RUNS = 1000;

type Bench = { avg: number; worst: number; total: number };

function runBench(): Bench {
  let worst = 0;
  const start = performance.now();
  for (let i = 0; i < BENCH_RUNS; i++) {
    const { ms } = search(commands, BENCH_QUERIES[i % BENCH_QUERIES.length], { shell: 'all', category: null });
    if (ms > worst) worst = ms;
  }
  const total = performance.now() - start;
  return { avg: total / BENCH_RUNS, worst, total };
}

export default function AboutScreen() {
  const c = usePalette();
  const [bench, setBench] = useState<Bench | null>(null);

  const Stat = ({ value, label }: { value: string; label: string }) => (
    <View style={[styles.stat, { backgroundColor: c.card, borderColor: c.border }]}>
      <Text style={[styles.statValue, { color: c.accent }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: c.muted }]}>{label}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.body}>
      <Text style={[styles.title, { color: c.text }]}>ShellDeck</Text>
      <Text style={[styles.lead, { color: c.muted }]}>
        A fast, offline cheatsheet for Linux and the bash, zsh, fish and csh shells. Every command has its syntax and real examples you can copy.
      </Text>

      <View style={styles.stats}>
        <Stat value={String(commands.length)} label="commands" />
        <Stat value={String(totalExamples)} label="examples" />
        <Stat value={String(compareRows.length)} label="side-by-side tasks" />
      </View>

      <SectionTitle>Speed</SectionTitle>
      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
        <Row label="Load and index everything" value={`${parseMs.toFixed(1)} ms`} />
        {bench ? (
          <>
            <Row label={`Average search (${BENCH_RUNS} runs)`} value={`${bench.avg.toFixed(3)} ms`} />
            <Row label="Slowest single search" value={`${bench.worst.toFixed(2)} ms`} />
            <Row label="All runs together" value={`${bench.total.toFixed(0)} ms`} />
          </>
        ) : null}
        <Pressable
          accessibilityRole="button"
          onPress={() => setBench(runBench())}
          style={({ pressed }) => [styles.button, { backgroundColor: c.accent, opacity: pressed ? 0.8 : 1 }]}>
          <Ionicons name="speedometer" size={18} color="#04130A" />
          <Text style={styles.buttonText}>{bench ? 'Run again' : `Run ${BENCH_RUNS} searches`}</Text>
        </Pressable>
        <Text style={[styles.note, { color: c.subtle }]}>Everything is bundled in the app, so search never waits for the network. A screen refresh takes about 16 ms; a search takes a tiny fraction of that.</Text>
      </View>

      <SectionTitle>Shells</SectionTitle>
      {shells.map((s) => (
        <View key={s.id} style={[styles.shell, { borderLeftColor: s.color }]}>
          <Text style={[styles.shellName, { color: c.text }]}>
            {s.label} <Text style={{ color: c.subtle, fontWeight: '500' }}>· {commands.filter((x) => x.shell === s.id).length}</Text>
          </Text>
          <Text style={[styles.shellBlurb, { color: c.muted }]}>{s.blurb}</Text>
        </View>
      ))}

      <SectionTitle>Made by</SectionTitle>
      <Text style={[styles.lead, { color: c.text }]}>Olateju Olamide Emmanuel</Text>
      <Pressable accessibilityRole="link" onPress={() => WebBrowser.openBrowserAsync(REPO_URL)} style={styles.link}>
        <Ionicons name="logo-github" size={18} color={c.accent} />
        <Text style={[styles.linkText, { color: c.accent }]}>github.com/tejHacks/shelldeck</Text>
      </Pressable>
    </ScrollView>
  );

  function Row({ label, value }: { label: string; value: string }) {
    return (
      <View style={styles.row}>
        <Text style={[styles.rowLabel, { color: c.muted }]}>{label}</Text>
        <Text style={[styles.rowValue, { color: c.text }]}>{value}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  body: { padding: 16, paddingBottom: 48 },
  title: { fontSize: 28, fontWeight: '900', fontFamily: mono },
  lead: { fontSize: 15, lineHeight: 22, marginTop: 6 },
  stats: { flexDirection: 'row', gap: 10, marginTop: 16 },
  stat: { flex: 1, borderWidth: 1, borderRadius: radius.md, padding: 12, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '900', fontFamily: mono },
  statLabel: { fontSize: 12, marginTop: 2, textAlign: 'center' },
  card: { borderWidth: 1, borderRadius: radius.lg, padding: 14, gap: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  rowLabel: { fontSize: 14, flex: 1 },
  rowValue: { fontSize: 14, fontFamily: mono, fontWeight: '700' },
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 46, borderRadius: radius.pill, marginTop: 4 },
  buttonText: { color: '#04130A', fontWeight: '800', fontSize: 15 },
  note: { fontSize: 12.5, lineHeight: 18 },
  shell: { borderLeftWidth: 3, paddingLeft: 12, marginBottom: 12 },
  shellName: { fontSize: 15, fontWeight: '800' },
  shellBlurb: { fontSize: 13.5, lineHeight: 19, marginTop: 2 },
  link: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  linkText: { fontSize: 15, fontWeight: '700' },
});
