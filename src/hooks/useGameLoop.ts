import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useGameStore, TICK_INTERVAL_MS } from '../store/useGameStore';

export function useGameLoop() {
  const tick = useGameStore((s) => s.tick);
  const applyOfflineEarnings = useGameStore((s) => s.applyOfflineEarnings);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startLoop = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(tick, TICK_INTERVAL_MS);
  };

  const stopLoop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    applyOfflineEarnings();
    startLoop();

    const handleAppState = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        applyOfflineEarnings();
        startLoop();
      } else {
        stopLoop();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppState);

    return () => {
      stopLoop();
      subscription.remove();
    };
  }, []);
}
