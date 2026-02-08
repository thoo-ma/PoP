// Re-export all type modules
export * from './auth';
export * from './navigation';
export * from './components';
export * from './sensors';
export * from './audio';

// Difficulty Modes (used across multiple features)
export type DifficultyMode = 'easy' | 'normal' | 'strict';

// NFT Sort Options (used in Vault and Marketplace)
export type SortOption = 'efficiency' | 'resilience' | 'comfort' | 'luck';
