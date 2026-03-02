import { StyleSheet } from 'react-native';
import { colors } from '@/constants';

export const styles = StyleSheet.create({
  // Compact mode styles (for grid views like Vault/Marketplace)
  containerCompact: {
    marginTop: 8,
    gap: 4,
  },
  propertyRowCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  propertyLabelCompact: {
    fontSize: 10,
    color: colors.propertyText,
    width: 50,
    marginRight: 4,
  },
  propertyBarWrapperCompact: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
    fontSize: 10,
    color: colors.propertyText,
    fontWeight: '600',
    width: 20,
    textAlign: 'right',
  },

  // Detailed mode styles (for full screen views like Poop)
  containerDetailed: {
    marginTop: 8,
    gap: 8,
  },
  propertyRowDetailed: {
    gap: 4,
  },
  propertyLabelDetailed: {
    fontSize: 12,
    fontWeight: '600',
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
    fontSize: 12,
    color: colors.textDark,
    fontWeight: '700',
    width: 26,
    textAlign: 'right',
  },
});
