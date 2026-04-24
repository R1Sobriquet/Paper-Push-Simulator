import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
} from 'react-native';
import { StatsHeader } from './src/components/StatsHeader';
import { StampButton } from './src/components/StampButton';
import { UpgradeCard } from './src/components/UpgradeCard';
import { UPGRADES } from './src/constants/upgrades';
import { useGameLoop } from './src/hooks/useGameLoop';

function GridBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: 30 }).map((_, rowIdx) => (
        <View key={rowIdx} style={gridStyles.row}>
          {Array.from({ length: 20 }).map((_, colIdx) => (
            <View key={colIdx} style={gridStyles.cell} />
          ))}
        </View>
      ))}
    </View>
  );
}

const gridStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  cell: {
    flex: 1,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.06)',
  },
});

export default function App() {
  useGameLoop();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F0" />

      <View style={styles.appHeader}>
        <Text style={styles.appTitle}>PAPER PUSH SIMULATOR</Text>
        <Text style={styles.appSubtitle}>DEPT. OF FORM VALIDATION — v1.0</Text>
      </View>

      <StatsHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <GridBackground />

        <View style={styles.stampSection}>
          <View style={styles.sectionLabel}>
            <Text style={styles.sectionLabelText}>[ WORKSTATION ]</Text>
          </View>
          <StampButton />
        </View>

        <View style={styles.divider} />

        <View style={styles.shopSection}>
          <View style={styles.sectionLabel}>
            <Text style={styles.sectionLabelText}>[ PROCUREMENT ]</Text>
          </View>
          {UPGRADES.map((upgrade) => (
            <UpgradeCard key={upgrade.id} upgrade={upgrade} />
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ALL FORMS MUST BE SUBMITTED IN TRIPLICATE
          </Text>
          <Text style={styles.footerText}>
            UNAUTHORIZED STAMPING IS A CLASS-B INFRACTION
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  appHeader: {
    backgroundColor: '#1A1A1A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
  },
  appTitle: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '700',
    color: '#F5F5F0',
    letterSpacing: 4,
  },
  appSubtitle: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: '#888888',
    letterSpacing: 2,
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  stampSection: {
    paddingVertical: 40,
    alignItems: 'center',
    minHeight: 280,
    justifyContent: 'center',
  },
  shopSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  sectionLabel: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 0,
  },
  sectionLabelText: {
    fontFamily: 'monospace',
    fontSize: 10,
    letterSpacing: 3,
    color: '#555555',
  },
  divider: {
    height: 2,
    backgroundColor: '#1A1A1A',
  },
  footer: {
    paddingTop: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'monospace',
    fontSize: 8,
    color: '#AAAAAA',
    letterSpacing: 1,
    marginBottom: 4,
    textAlign: 'center',
  },
});
