import { StyleSheet } from 'react-native';
import { colors, typography } from '../constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    ...typography.title,
    marginBottom: 8,
  },
  description: {
    ...typography.description,
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  nftContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  nftCard: {
    width: '100%',
    maxWidth: 280,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  nftImage: {
    width: '100%',
    height: '100%',
  },
  levelBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#6366f1',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  levelBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tierBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
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
  tierBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  nftInfo: {
    width: '100%',
  },
  nftName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 10,
    textAlign: 'center',
  },
  poopButton: {
    backgroundColor: '#000',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 8,
  },
  poopButtonDisabled: {
    backgroundColor: '#9ca3af',
    opacity: 0.6,
  },
  poopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
