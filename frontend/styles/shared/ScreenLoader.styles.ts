import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    fontSize: fontSizes.display,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    textAlign: 'center',
    color: colors.title,
  },
  indicator: {
    marginTop: spacing.xxxl,
  },
  message: {
    marginTop: spacing.md,
    fontSize: fontSizes.md,
    color: colors.text,
  },
});
