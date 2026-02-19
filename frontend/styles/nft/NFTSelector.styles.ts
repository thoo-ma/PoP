import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  selectorArrow: {
    width: 52,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectorArrowText: {
    fontSize: 22,
    lineHeight: 28,
    color: '#374151',
    fontWeight: '400',
  },
  selectorCounter: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    minWidth: 48,
    textAlign: 'center',
  },
});
