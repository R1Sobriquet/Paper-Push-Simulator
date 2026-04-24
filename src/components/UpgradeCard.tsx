import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ShoppingCart, Lock } from 'lucide-react-native';
import { UpgradeDefinition, getScaledCost } from '../constants/upgrades';
import { useGameStore } from '../store/useGameStore';

interface Props {
  upgrade: UpgradeDefinition;
}

export function UpgradeCard({ upgrade }: Props) {
  const forms = useGameStore((s) => s.forms);
  const ownedUpgrades = useGameStore((s) => s.ownedUpgrades);
  const purchaseUpgrade = useGameStore((s) => s.purchaseUpgrade);

  const quantity = ownedUpgrades[upgrade.id] ?? 0;
  const cost = getScaledCost(upgrade.baseCost, quantity);
  const canAfford = forms >= cost;

  return (
    <Pressable
      onPress={() => purchaseUpgrade(upgrade.id)}
      disabled={!canAfford}
      style={({ pressed }) => [
        styles.card,
        !canAfford && styles.cardLocked,
        pressed && canAfford && styles.cardPressed,
      ]}
    >
      <View style={styles.left}>
        <View style={styles.iconBox}>
          {canAfford ? (
            <ShoppingCart size={18} color="#1A1A1A" strokeWidth={1.5} />
          ) : (
            <Lock size={18} color="#AAAAAA" strokeWidth={1.5} />
          )}
        </View>
        <View>
          <Text style={[styles.name, !canAfford && styles.dimText]}>
            {upgrade.name}
          </Text>
          <Text style={styles.flavor}>{upgrade.flavorText}</Text>
        </View>
      </View>

      <View style={styles.right}>
        <Text style={[styles.bonus, !canAfford && styles.dimText]}>
          {upgrade.description}
        </Text>
        <View style={[styles.costBadge, canAfford && styles.costBadgeAffordable]}>
          <Text style={[styles.costText, canAfford && styles.costTextAffordable]}>
            {cost} VF
          </Text>
        </View>
        {quantity > 0 && (
          <Text style={styles.ownedText}>×{quantity}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#AAAAAA',
    backgroundColor: '#F5F5F0',
    padding: 12,
    marginBottom: 8,
  },
  cardLocked: {
    borderColor: '#DDDDDD',
    backgroundColor: '#EEEEEE',
  },
  cardPressed: {
    backgroundColor: '#E0E0DB',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  name: {
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 0.5,
  },
  flavor: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#777777',
    marginTop: 2,
    maxWidth: 160,
  },
  dimText: {
    color: '#AAAAAA',
  },
  right: {
    alignItems: 'flex-end',
  },
  bonus: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  costBadge: {
    borderWidth: 2,
    borderColor: '#AAAAAA',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  costBadgeAffordable: {
    borderColor: '#1A1A1A',
    backgroundColor: '#1A1A1A',
  },
  costText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#AAAAAA',
  },
  costTextAffordable: {
    color: '#F5F5F0',
  },
  ownedText: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#777777',
    marginTop: 3,
  },
});
