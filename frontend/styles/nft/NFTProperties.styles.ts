import { StyleSheet } from 'react-native';
import { colors, fontSizes, fontWeights, spacing } from '@/constants';

export const styles = StyleSheet.create({
  // Compact mode styles (for grid views like Vault/Marketplace)
  containerCompact: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  propertyRowCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  propertyLabelCompact: {
    fontSize: fontSizes.xs,
    color: colors.propertyText,
    width: 50,
    marginRight: spacing.xs,
  },
  propertyBarWrapperCompact: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  propertyBarBackgroundCompact: {
    flex: 1,
    height: 6,
    backgroundColor: colors.propertyBg,
    borderRadius: 3,
    overflow: 'hidden',
  },
  propertyBarFillCompact: {
    height: '100%',
    borderRadius: 3,
  },
  propertyValueCompact: {
    fontSize: fontSizes.xs,
    color: colors.propertyText,
    fontWeight: fontWeights.semibold,
    width: 20,
    textAlign: 'right',
  },

  // Detailed mode styles (for full screen views like Poop)
  containerDetailed: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  propertyRowDetailed: {
    gap: spacing.xs,
  },
  propertyLabelDetailed: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.propertyText,
    marginBottom: 2,
  },
  propertyBarWrapperDetailed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  propertyBarBackgroundDetailed: {
    flex: 1,
    height: 8,
    backgroundColor: colors.propertyBg,
    borderRadius: 4,
    overflow: 'hidden',
  },
  propertyBarFillDetailed: {
    height: '100%',
    borderRadius: 4,
  },
  propertyValueDetailed: {
    fontSize: fontSizes.sm,
    color: colors.textDark,
    fontWeight: fontWeights.bold,
    width: 26,
    textAlign: 'right',
  },
});
