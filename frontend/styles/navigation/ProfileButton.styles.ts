import { StyleSheet } from 'react-native';
import { colors, radii, spacing } from '@/constants';

export const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 60,
    left: spacing.lg,
    zIndex: 100,
    padding: spacing.sm,
    backgroundColor: colors.bgOverlay,
    borderRadius: radii.xxl,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
