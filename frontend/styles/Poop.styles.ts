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
    marginBottom: 24,
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
    width: '100%',
    height: 200,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  nftImage: {
    width: '100%',
    height: '100%',
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
  poopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
