import { StyleSheet } from 'react-native';
import { colors } from '@/constants';

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
    backgroundColor: colors.bgLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectorArrowText: {
    fontSize: 22,
    lineHeight: 28,
    color: colors.title,
    fontWeight: '400',
  },
  selectorCounter: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    minWidth: 48,
    textAlign: 'center',
  },
});
