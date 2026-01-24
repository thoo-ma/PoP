import Home from '../screens/Home';
import ProofOfImmobility from '../screens/ProofOfImmobility';
import ProofOfTime from '../screens/ProofOfTime';
import type { ComponentType } from 'react';

export interface PageConfig {
  id: string;
  component: ComponentType<any>;
}

/**
 * Configuration for app pages/screens
 */
export const PAGES: PageConfig[] = [
  { id: '1', component: Home },
  { id: '2', component: ProofOfImmobility },
  { id: '3', component: ProofOfTime },
];

/**
 * Configuration for FlatList viewability detection
 */
export const VIEWABILITY_CONFIG = {
  itemVisiblePercentThreshold: 50,
};
