import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useGameStore } from '../store/useGameStore';

function formatForms(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
  return Math.floor(n).toString();
}

export function StatsHeader() {
  const forms = useGameStore((s) => s.forms);
  const formsPerSecond = useGameStore((s) => s.formsPerSecond);
  const formsPerClick = useGameStore((s) => s.formsPerClick);

  const [displayedForms, setDisplayedForms] = useState(formatForms(forms));
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const prevForms = useRef(forms);

  useEffect(() => {
    const newFormatted = formatForms(forms);
    if (newFormatted !== displayedForms) {
      setDisplayedForms(newFormatted);
      // Blink cursor on change
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 60, useNativeDriver: true }),
      ]).start();
    }
    prevForms.current = forms;
  }, [forms]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>VALIDATED FORMS</Text>
      <View style={styles.valueRow}>
        <Animated.Text style={[styles.value, { opacity: blinkAnim }]}>
          {displayedForms}
        </Animated.Text>
        <Text style={styles.unit}> VF</Text>
      </View>
      <View style={styles.statsRow}>
        <Text style={styles.stat}>{formsPerSecond.toFixed(1)} VF/sec</Text>
        <Text style={styles.statDivider}>|</Text>
        <Text style={styles.stat}>{formsPerClick} VF/click</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F0',
    borderBottomWidth: 2,
    borderBottomColor: '#1A1A1A',
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
  },
  label: {
    fontFamily: 'monospace',
    fontSize: 10,
    letterSpacing: 4,
    color: '#555555',
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  value: {
    fontFamily: 'monospace',
    fontSize: 42,
    fontWeight: '700',
    color: '#1A1A1A',
    lineHeight: 48,
  },
  unit: {
    fontFamily: 'monospace',
    fontSize: 16,
    color: '#555555',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  stat: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#555555',
  },
  statDivider: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#AAAAAA',
    marginHorizontal: 8,
  },
});
