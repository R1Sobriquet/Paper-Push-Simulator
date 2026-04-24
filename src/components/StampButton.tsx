import React, { useCallback } from 'react';
import { StyleSheet, Text, Pressable, View, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useGameStore } from '../store/useGameStore';

let impactAsync: ((style: any) => Promise<void>) | null = null;
try {
  // Dynamically import to avoid crash on web/simulator
  const Haptics = require('expo-haptics');
  impactAsync = Haptics.impactAsync;
} catch (_) {}

const ImpactFeedbackStyle = (() => {
  try {
    return require('expo-haptics').ImpactFeedbackStyle;
  } catch (_) {
    return { Medium: 'Medium' };
  }
})();

export function StampButton() {
  const processClick = useGameStore((s) => s.processClick);
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const handlePress = useCallback(() => {
    processClick();

    if (impactAsync) {
      impactAsync(ImpactFeedbackStyle.Medium).catch(() => {});
    }

    scale.value = withSequence(
      withTiming(0.88, { duration: 80, easing: Easing.out(Easing.quad) }),
      withTiming(1.06, { duration: 100, easing: Easing.out(Easing.back(4)) }),
      withTiming(1, { duration: 80, easing: Easing.inOut(Easing.quad) })
    );

    translateY.value = withSequence(
      withTiming(8, { duration: 80, easing: Easing.out(Easing.quad) }),
      withTiming(-4, { duration: 100, easing: Easing.out(Easing.back(3)) }),
      withTiming(0, { duration: 80, easing: Easing.inOut(Easing.quad) })
    );
  }, [processClick]);

  return (
    <Pressable onPress={handlePress} style={styles.pressable}>
      <Animated.View style={[styles.stampOuter, animatedStyle]}>
        {/* Stamp ink pad */}
        <View style={styles.inkPad}>
          <Text style={styles.inkText}>INK</Text>
        </View>
        {/* Stamp body */}
        <View style={styles.stampBody}>
          <Text style={styles.stampText}>STAMP</Text>
        </View>
        {/* Stamp face (the part that marks) */}
        <View style={styles.stampFace}>
          <Text style={styles.approvedText}>APPROVED</Text>
          <View style={styles.stampBorder}>
            <Text style={styles.formText}>FORM</Text>
          </View>
        </View>
      </Animated.View>
      <Text style={styles.hint}>TAP TO STAMP</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampOuter: {
    alignItems: 'center',
  },
  inkPad: {
    width: 140,
    height: 20,
    backgroundColor: '#2A2A2A',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  inkText: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: '#F5F5F0',
    letterSpacing: 3,
  },
  stampBody: {
    width: 140,
    height: 50,
    backgroundColor: '#3A3A3A',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderTopWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#AAAAAA',
    letterSpacing: 4,
  },
  stampFace: {
    width: 140,
    height: 70,
    backgroundColor: '#F5F5F0',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderTopWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  approvedText: {
    fontFamily: 'monospace',
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 2,
  },
  stampBorder: {
    borderWidth: 2,
    borderColor: '#1A1A1A',
    paddingHorizontal: 12,
    paddingVertical: 2,
    marginTop: 4,
  },
  formText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#1A1A1A',
    letterSpacing: 4,
  },
  hint: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: '#AAAAAA',
    letterSpacing: 3,
    marginTop: 16,
  },
});
