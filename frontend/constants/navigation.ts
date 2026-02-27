import { Vault, Breed, Marketplace, Repair, Poop } from '@/screens';
import type { PageConfig } from '@/types';

/**
 * Configuration for app pages/screens
 */
export const PAGES: PageConfig[] = [
  { id: '1', component: Poop },
  { id: '6', component: Vault },
  { id: '7', component: Breed },
  { id: '8', component: Marketplace },
  { id: '9', component: Repair },
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
