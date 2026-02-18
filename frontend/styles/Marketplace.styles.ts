import { StyleSheet } from 'react-native';
import { colors, typography } from '../constants';
import { sortStyles as baseSortStyles } from './Sort.styles';

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
    marginBottom: 12,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
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
    color: '#fff',
  },
  sortContainer: {
    ...baseSortStyles.sortContainer,
    marginTop: 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    width: '100%',
  },
  infoBanner: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  infoBannerText: {
    fontSize: 14,
    color: '#78350f',
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
    fontSize: 14,
    fontWeight: '700',
    color: colors.title,
  },
  buyButton: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  unlistButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.buttonPrimary,
  },  unlistButtonDisabled: {
    borderColor: '#9ca3af',
    opacity: 0.6,
  },
  unlistButtonText: {
    color: colors.buttonPrimary,
    fontSize: 12,
    fontWeight: '600',
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
    fontSize: 16,
    fontWeight: '600',
    color: colors.title,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 20,
  },
});