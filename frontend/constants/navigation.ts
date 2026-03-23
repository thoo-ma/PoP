import { Vault, Breed, Marketplace, Repair, Poop } from '@/screens';
import type { PageConfig } from '@/types';

/**
 * Configuration for app pages/screens
 */
export const PAGES: PageConfig[] = [
  { id: '1', title: 'Poop', component: Poop },
  { id: '6', title: 'Vault', component: Vault },
  { id: '7', title: 'Breed', component: Breed },
  { id: '8', title: 'Marketplace', component: Marketplace },
  { id: '9', title: 'Repair', component: Repair },
];

/**
 * Viewability threshold percentage for FlatList items
 */
export const VIEWABILITY_THRESHOLD_PERCENT = 50;

/**
 * Configuration for FlatList viewability detection
 */
export const VIEWABILITY_CONFIG = {
  itemVisiblePercentThreshold: VIEWABILITY_THRESHOLD_PERCENT,
};
