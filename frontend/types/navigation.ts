import type { ComponentType } from 'react';

/**
 * Configuration for a single page/screen in the app
 */
export interface PageConfig {
  id: string;
  component: ComponentType<{}>;
  isPrimary?: boolean;
}

/**
 * Props for PageIndicator component
 */
export interface PageIndicatorProps {
  totalPages: number;
  currentPage: number;
  onPageChange?: (pageIndex: number) => void;
}

/**
 * Props for MoreMenu component
 */
export interface MoreMenuProps {
  visible: boolean;
  onClose: () => void;
  onSelectPage: (pageIndex: number) => void;
  currentPage: number;
}

/**
 * FlatList viewability configuration
 */
export interface ViewabilityConfig {
  itemVisiblePercentThreshold: number;
}
