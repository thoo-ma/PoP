import { StyleSheet } from 'react-native';
import { colors, typography, layout } from '../constants/theme';

export const styles = StyleSheet.create({
  container: {
    ...layout.container,
    backgroundColor: colors.timeBackground,
  },
  title: {
    ...typography.title,
    color: colors.timeTitle,
  },
  description: {
    ...typography.description,
    color: colors.timeText,
  },
  timerCard: {
    marginBottom: 16,
    minWidth: 250,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  button: {
    backgroundColor: colors.timeTitle,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#dc2626',
  },
  resetButton: {
    backgroundColor: colors.timeCard,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    marginBottom: 16,
    minWidth: 250,
  },
  hint: {
    ...typography.hint,
    color: colors.timeHint,
    marginTop: 24,
  },
});
