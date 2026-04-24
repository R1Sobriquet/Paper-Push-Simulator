export type UpgradeType = 'perSecond' | 'perClick';

export interface UpgradeDefinition {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  type: UpgradeType;
  value: number;
  flavorText: string;
}

export const UPGRADES: UpgradeDefinition[] = [
  {
    id: 'unpaid_intern',
    name: 'Unpaid Intern',
    description: '+1 VF/sec',
    baseCost: 15,
    type: 'perSecond',
    value: 1,
    flavorText: 'Eager to learn. Paid in experience.',
  },
  {
    id: 'high_quality_ink',
    name: 'High-Quality Ink',
    description: '+2 VF/click',
    baseCost: 50,
    type: 'perClick',
    value: 2,
    flavorText: 'Regulation-grade. Smudge-resistant.',
  },
];

export const getScaledCost = (baseCost: number, quantity: number): number =>
  Math.floor(baseCost * Math.pow(1.15, quantity));
