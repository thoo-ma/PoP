import { StyleSheet } from 'react-native';
import { colors, typography } from '../constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    ...typography.title,
    marginBottom: 8,
  },
  description: {
    ...typography.description,
    marginBottom: 32,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  nftContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  nftCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nftImage: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    marginBottom: 16,
  },
  nftInfo: {
    width: '100%',
  },
  nftName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 12,
    textAlign: 'center',
  },
  healthInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  healthLabel: {
    fontSize: 14,
    color: colors.text,
    marginRight: 8,
  },
  healthBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
  },
  healthBar: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  healthValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.value,
    minWidth: 42,
    textAlign: 'right',
  },
  poopButton: {
    backgroundColor: '#000',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 8,
  },
  poopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
