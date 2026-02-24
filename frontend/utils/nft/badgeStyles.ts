import type { ViewStyle } from 'react-native';
import { colors, RARITY_COLORS } from '@/constants';
import type { NFTType, NFTRarity } from '@/types/nft';

export const TYPE_BADGE_STYLES: Record<NFTType, ViewStyle> = {
  'cruise-seat': { backgroundColor: RARITY_COLORS.common },
  'turbo-flush': { backgroundColor: RARITY_COLORS.legendary },
  'zen-fortress': { backgroundColor: colors.luck },
};

export const RARITY_BADGE_STYLES: Record<NFTRarity, ViewStyle> = {
  common: { backgroundColor: RARITY_COLORS.common },
  rare: { backgroundColor: RARITY_COLORS.rare },
  legendary: { backgroundColor: RARITY_COLORS.legendary },
  transcendent: { backgroundColor: RARITY_COLORS.transcendent },
};
