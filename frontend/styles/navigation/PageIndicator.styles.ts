import { StyleSheet } from 'react-native';
import { colors } from '@/constants';

export const styles = StyleSheet.create({
  pagination: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingMenu: {
    flexDirection: 'row',
    backgroundColor: colors.bgOverlayFull,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 4,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  iconWrapper: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  iconLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.inactive,
    marginTop: 4,
  },
  iconLabelActive: {
    color: colors.active,
    fontWeight: '700',
  },
});
