import { StyleSheet } from 'react-native';
import { colors, fontWeights, radii, spacing, typography } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 80,
  },
  title: {
    ...typography.title,
    color: colors.title,
  },
  description: {
    ...typography.description,
    color: colors.text,
    marginBottom: spacing.base,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  listButton: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
    marginTop: spacing.xs,
  },
  listButtonDisabled: {
    backgroundColor: colors.disabled,
    opacity: 0.6,
  },
  listButtonText: {
    color: colors.buttonText,
    fontSize: 11,
    fontWeight: fontWeights.semibold,
    textAlign: 'center',
  },
  allocateButton: {
    backgroundColor: colors.level,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
    marginTop: spacing.xs,
  },
  allocateButtonText: {
    color: colors.buttonText,
    fontSize: 11,
    fontWeight: fontWeights.bold,
    textAlign: 'center',
  },
});