import { StyleSheet } from 'react-native';
import { colors, typography } from '../constants';
import { sortStyles as baseSortStyles } from './Sort.styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 60,
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
    backgroundColor: colors.button,
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
  nftCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f3f4f6',
    position: 'relative',
  },
  nftImage: {
    width: '100%',
    height: '100%',
  },
  levelBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#6366f1',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  levelText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tierBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  chillBadge: {
    backgroundColor: '#94a3b8',
  },
  nitroBadge: {
    backgroundColor: '#f59e0b',
  },
  omegaBadge: {
    backgroundColor: '#8b5cf6',
  },
  'cruise-seatBadge': {
    backgroundColor: '#94a3b8',
  },
  'turbo-flushBadge': {
    backgroundColor: '#f59e0b',
  },
  'zen-fortressBadge': {
    backgroundColor: '#8b5cf6',
  },
  tierText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  rarityBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  commonBadge: {
    backgroundColor: '#94a3b8',
  },
  rareBadge: {
    backgroundColor: '#3b82f6',
  },
  legendaryBadge: {
    backgroundColor: '#f59e0b',
  },
  transcendentBadge: {
    backgroundColor: '#a855f7',
  },
  rarityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardContent: {
    padding: 12,
  },
  nftName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.title,
    marginBottom: 4,
  },
  seller: {
    fontSize: 12,
    color: colors.text,
    marginBottom: 8,
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
    backgroundColor: colors.button,
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
    borderColor: colors.button,
  },
  unlistButtonDisabled: {
    borderColor: '#9ca3af',
    opacity: 0.6,
  },
  unlistButtonText: {
    color: colors.button,
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
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