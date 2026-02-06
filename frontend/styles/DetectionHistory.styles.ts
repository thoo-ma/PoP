import { StyleSheet } from 'react-native';
import { colors, typography, layout } from '../constants';

export const styles = StyleSheet.create({
  container: {
    ...layout.container,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.title,
    color: colors.title,
  },
  description: {
    ...typography.description,
    color: colors.text,
  },
  summaryCard: {
    marginBottom: 24,
    minWidth: 280,
  },
  listContainer: {
    width: '100%',
    maxWidth: 500,
    flex: 1,
  },
  list: {
    paddingHorizontal: 20,
  },
  listContent: {
    paddingBottom: 100,
  },
  detectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detectionIcon: {
    fontSize: 24,
  },
  detectionDate: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detectionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  detectionLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  detectionValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.hint,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  hint: {
    ...typography.hint,
    color: colors.hint,
    position: 'absolute',
    bottom: 40,
  },
});
