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
  sectionContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timelapseContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  timelapseButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    borderWidth: 2,
    borderColor: '#d1d5db',
    minWidth: 60,
    alignItems: 'center',
  },
  timelapseButtonActive: {
    backgroundColor: colors.card,
    borderColor: colors.card,
  },
  timelapseText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  timelapseTextActive: {
    color: '#fff',
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
  buttonStop: {
    backgroundColor: '#ff6b6b',
  },
  buttonRecording: {
    backgroundColor: '#dc2626',
  },
  buttonAnalyze: {
    backgroundColor: '#8b5cf6',
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
