import { StyleSheet } from 'react-native';
import { colors } from '@/constants';

export const tabStyles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.bgLight,
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: colors.buttonPrimary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  tabTextActive: {
    color: colors.buttonText,
  },
});
