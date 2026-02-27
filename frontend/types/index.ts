import type { Tables } from '@shared';

// Re-export all type modules
export * from './auth';
export * from './navigation';
export * from './components';
export * from './sensors';
export * from './audio';
export * from './nft';

// Canonical DB row type aliases
/** Row type for public.flush_detections — single source of truth. */
export type DetectionRecord = Tables<'flush_detections'>;

// Difficulty Modes (used across multiple features)
export type DifficultyMode = 'easy' | 'normal' | 'strict';

// NFT Sort Options (used in Vault and Marketplace)
export type SortOption = 'efficiency' | 'resilience' | 'comfort' | 'luck' | 'level';
