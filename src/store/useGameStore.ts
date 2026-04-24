import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UPGRADES, getScaledCost } from '../constants/upgrades';

const FPS = 20;
export const TICK_INTERVAL_MS = 1000 / FPS;

interface OwnedUpgrade {
  id: string;
  quantity: number;
}

interface GameState {
  forms: number;
  lifetimeForms: number;
  formsPerClick: number;
  formsPerSecond: number;
  lastSaved: number;
  ownedUpgrades: Record<string, number>;

  processClick: () => void;
  purchaseUpgrade: (id: string) => void;
  tick: () => void;
  applyOfflineEarnings: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      forms: 0,
      lifetimeForms: 0,
      formsPerClick: 1,
      formsPerSecond: 0,
      lastSaved: Date.now(),
      ownedUpgrades: {},

      processClick() {
        const { formsPerClick } = get();
        set((s) => ({
          forms: s.forms + formsPerClick,
          lifetimeForms: s.lifetimeForms + formsPerClick,
        }));
      },

      purchaseUpgrade(id: string) {
        const { forms, ownedUpgrades } = get();
        const def = UPGRADES.find((u) => u.id === id);
        if (!def) return;

        const quantity = ownedUpgrades[id] ?? 0;
        const cost = getScaledCost(def.baseCost, quantity);

        if (forms < cost) return;

        const newOwned = { ...ownedUpgrades, [id]: quantity + 1 };

        let perClick = 1;
        let perSecond = 0;

        for (const upgrade of UPGRADES) {
          const qty = newOwned[upgrade.id] ?? 0;
          if (upgrade.type === 'perClick') {
            perClick += upgrade.value * qty;
          } else {
            perSecond += upgrade.value * qty;
          }
        }

        set({
          forms: forms - cost,
          ownedUpgrades: newOwned,
          formsPerClick: perClick,
          formsPerSecond: perSecond,
        });
      },

      tick() {
        const { formsPerSecond } = get();
        if (formsPerSecond <= 0) return;
        const earned = formsPerSecond / FPS;
        set((s) => ({
          forms: s.forms + earned,
          lifetimeForms: s.lifetimeForms + earned,
          lastSaved: Date.now(),
        }));
      },

      applyOfflineEarnings() {
        const { lastSaved, formsPerSecond } = get();
        const secondsAway = Math.max(0, (Date.now() - lastSaved) / 1000);
        // Cap offline earnings at 8 hours
        const cappedSeconds = Math.min(secondsAway, 8 * 60 * 60);
        const earned = formsPerSecond * cappedSeconds;
        if (earned > 0) {
          set((s) => ({
            forms: s.forms + earned,
            lifetimeForms: s.lifetimeForms + earned,
            lastSaved: Date.now(),
          }));
        }
      },
    }),
    {
      name: 'paper-push-game',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
