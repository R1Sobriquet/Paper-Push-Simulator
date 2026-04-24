# PAPER PUSH SIMULATOR
### DEPT. OF FORM VALIDATION — v1.0

> A satirical idle game where bureaucracy is the gameplay.  
> Stamp forms. Hire interns. Acquire ink. Repeat indefinitely.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Running the App](#running-the-app)
4. [Gameplay](#gameplay)
5. [Project Structure](#project-structure)
6. [Architecture](#architecture)
7. [Extending the Game](#extending-the-game)

---

## Prerequisites

| Tool | Minimum version |
|---|---|
| Node.js | 18.x |
| npm | 9.x |
| Expo Go (mobile) | Latest |
| iOS Simulator / Android Emulator | Optional |

---

## Installation

```bash
# Clone the repository
git clone https://github.com/R1Sobriquet/Paper-Push-Simulator
cd Paper-Push-Simulator

# Install dependencies
npm install
```

---

## Running the App

```bash
# Start the Expo dev server (shows QR code)
npm start

# Target a specific platform directly
npm run android   # Android emulator or device
npm run ios       # iOS simulator (macOS only)
npm run web       # Browser (limited haptics support)
```

Scan the QR code with **Expo Go** (iOS / Android) to run on a physical device.

---

## Gameplay

### Core Loop

1. **Tap the stamp** in the `[ WORKSTATION ]` section to earn Validated Forms (VF).
2. Accumulate enough VF to buy upgrades in the `[ PROCUREMENT ]` section.
3. Upgrades increase your passive income (VF/sec) or your tap power (VF/click).
4. The game saves automatically and **calculates offline earnings** when you return (capped at 8 hours).

### Currency

**Validated Forms (VF)** — the single in-game currency, earned by stamping or passively over time.

### Upgrades

| Name | Base Cost | Effect | Flavor Text |
|---|---|---|---|
| Unpaid Intern | 15 VF | +1 VF/sec | *Eager to learn. Paid in experience.* |
| High-Quality Ink | 50 VF | +2 VF/click | *Regulation-grade. Smudge-resistant.* |

**Cost scaling formula:** each additional purchase of the same upgrade costs more.

```
cost = floor(baseCost × 1.15^quantity)
```

Example — Unpaid Intern costs:

| Purchase # | Cost |
|---|---|
| 1st | 15 VF |
| 2nd | 17 VF |
| 3rd | 20 VF |
| 5th | 26 VF |
| 10th | 60 VF |

---

## Project Structure

```
Paper-Push-Simulator/
├── App.tsx                        # Root component, layout, grid background
├── index.ts                       # Expo entry point
├── app.json                       # Expo configuration
├── src/
│   ├── constants/
│   │   └── upgrades.ts            # Upgrade definitions + cost formula
│   ├── store/
│   │   └── useGameStore.ts        # Zustand store (state + actions)
│   ├── hooks/
│   │   └── useGameLoop.ts         # Game tick loop + offline earnings
│   └── components/
│       ├── StatsHeader.tsx        # VF balance display with blink animation
│       ├── StampButton.tsx        # Animated stamp + haptic feedback
│       └── UpgradeCard.tsx        # Shop item card
└── assets/                        # App icons and splash screen
```

---

## Architecture

### State — `useGameStore.ts`

Zustand store with `persist` middleware backed by `AsyncStorage`.  
Persisted under the key `paper-push-game`.

```ts
// State shape
{
  forms: number           // current VF balance
  lifetimeForms: number   // total VF ever earned
  formsPerClick: number   // VF earned per tap (default: 1)
  formsPerSecond: number  // passive VF income (default: 0)
  lastSaved: number       // timestamp used to compute offline earnings
  ownedUpgrades: Record<string, number>  // { upgrade_id: quantity }
}

// Actions
processClick()            // adds formsPerClick to balance
purchaseUpgrade(id)       // deducts cost, recalculates rates
tick()                    // adds formsPerSecond / FPS each frame
applyOfflineEarnings()    // catches up time since lastSaved (max 8h)
```

### Game Loop — `useGameLoop.ts`

Runs a `setInterval` at **20 FPS (50ms)** calling `tick()` on every frame.  
Hooks into `AppState` to pause the loop when the app goes to background and apply offline earnings when it returns to the foreground.

```
App foreground  →  start loop (setInterval @ 50ms)
App background  →  stop loop (clearInterval)
App foreground  →  applyOfflineEarnings() + restart loop
```

### Animation — `StampButton.tsx`

Uses **React Native Reanimated** shared values for a three-phase press animation:

```
Press down  →  scale 1.0 → 0.88  (80ms, ease-out)
Release     →  scale 0.88 → 1.06  (100ms, back overshoot)
Settle      →  scale 1.06 → 1.0   (80ms, ease-in-out)
```

A matching vertical `translateY` shift reinforces the physical stamp feel.  
`expo-haptics` fires `ImpactFeedbackStyle.Medium` on each press (native only).

---

## Extending the Game

### Adding a new upgrade

Edit `src/constants/upgrades.ts` and append to the `UPGRADES` array:

```ts
{
  id: 'rubber_stamp',        // unique snake_case id
  name: 'Rubber Stamp',
  description: '+5 VF/click',
  baseCost: 200,
  type: 'perClick',          // 'perClick' | 'perSecond'
  value: 5,
  flavorText: 'Pre-approved. Pre-inked. Pre-destined.',
}
```

No other files need to change — the store and shop UI read from `UPGRADES` dynamically.

### Resetting save data

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.removeItem('paper-push-game');
```

Or call this from a dev-only button during development.
