import { StyleSheet } from 'react-native';

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
    color: '#64748b',
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
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  propertyBarFillCompact: {
    height: '100%',
    borderRadius: 3,
  },
  propertyValueCompact: {
    fontSize: 10,
    color: '#475569',
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
    color: '#475569',
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
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  propertyBarFillDetailed: {
    height: '100%',
    borderRadius: 4,
  },
  propertyValueDetailed: {
    fontSize: 12,
    color: '#1e293b',
    fontWeight: '700',
    width: 26,
    textAlign: 'right',
  },
});
