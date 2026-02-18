import { StyleSheet } from 'react-native';

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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 4,
    shadowColor: '#000',
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
    color: '#d1d5db',
    marginTop: 4,
  },
  iconLabelActive: {
    color: '#000',
    fontWeight: '700',
  },
});
