import { Home, ProofOfImmobility, ProofOfFlush, DetectionHistory, ProofOfPoop, Vault, Breed, Marketplace } from '../screens';
import type { PageConfig } from '../types';

/**
 * Configuration for app pages/screens
 * Primary pages (swipeable): Home, Vault, Breed, Marketplace
 * Secondary pages (More menu only): Proofs and History
 */
export const PAGES: PageConfig[] = [
  { id: '1', component: Home, isPrimary: true },
  { id: '6', component: Vault, isPrimary: true },
  { id: '7', component: Breed, isPrimary: true },
  { id: '8', component: Marketplace, isPrimary: true },
  { id: '2', component: ProofOfImmobility, isPrimary: false },
  { id: '3', component: ProofOfFlush, isPrimary: false },
  { id: '4', component: ProofOfPoop, isPrimary: false },
  { id: '5', component: DetectionHistory, isPrimary: false },
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
