import { Home, ProofOfImmobility, ProofOfTime } from '../screens';
import type { PageConfig } from '../types';

/**
 * Configuration for app pages/screens
 */
export const PAGES: PageConfig[] = [
  { id: '1', component: Home },
  { id: '2', component: ProofOfImmobility },
  { id: '3', component: ProofOfTime },
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
