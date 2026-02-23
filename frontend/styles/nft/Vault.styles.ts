import { StyleSheet } from 'react-native';
import { colors, typography } from '@/constants';

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
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
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
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  listButtonDisabled: {
    backgroundColor: colors.disabled,
    opacity: 0.6,
  },
  listButtonText: {
    color: colors.buttonText,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
});