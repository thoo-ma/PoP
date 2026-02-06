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
  modeContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  modeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: colors.card,
    minWidth: 120,
    alignItems: 'center',
  },
  modeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    marginBottom: 16,
    minWidth: 250,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  button: {
    backgroundColor: colors.card,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonRecording: {
    backgroundColor: '#dc2626',
  },
  buttonAnalyze: {
    backgroundColor: colors.title,
  },
  buttonDisabled: {
    backgroundColor: '#d1d5db',
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  rateLimitText: {
    color: '#d97706',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
    fontWeight: '600',
  },
  hint: {
    ...typography.hint,
    color: colors.hint,
    marginTop: 24,
  },
});
