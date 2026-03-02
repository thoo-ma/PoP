import { StyleSheet } from 'react-native';
import { colors, fontSizes, fontWeights, radii, spacing, typography } from '@/constants';
import { sortStyles as baseSortStyles } from '@/styles/shared/Sort.styles';

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
    marginBottom: spacing.md,
  },
  sortContainer: {
    ...baseSortStyles.sortContainer,
    marginTop: 0,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
    width: '100%',
  },
  infoBanner: {
    backgroundColor: colors.resultWarningBg,
    borderRadius: radii.lg,
    padding: spacing.base,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.amber,
  },
  infoBannerText: {
    fontSize: fontSizes.md,
    color: colors.warningTextDark,
    textAlign: 'center',
    lineHeight: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.title,
  },
  buyButton: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
  },
  buyButtonText: {
    color: colors.buttonText,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
  },
  unlistButton: {
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.buttonPrimary,
  },  unlistButtonDisabled: {
    borderColor: colors.disabled,
    opacity: 0.6,
  },
  unlistButtonText: {
    color: colors.buttonPrimary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    width: '100%',
  },
  emptyText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.title,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: fontSizes.md,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 20,
  },
});