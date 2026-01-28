import { StyleSheet } from 'react-native';
import { colors, typography, layout } from '../constants';

export const styles = StyleSheet.create({
  container: {
    ...layout.container,
    backgroundColor: '#1a1a2e',
  },
  title: {
    ...typography.title,
    color: '#fbbf24',
  },
  description: {
    ...typography.description,
    color: '#e5e7eb',
  },
  sectionContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e5e7eb',
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
    backgroundColor: '#374151',
    borderWidth: 2,
    borderColor: '#4b5563',
    minWidth: 60,
    alignItems: 'center',
  },
  timelapseButtonActive: {
    backgroundColor: '#fbbf24',
    borderColor: '#fbbf24',
  },
  timelapseText: {
    color: '#e5e7eb',
    fontSize: 16,
    fontWeight: '600',
  },
  timelapseTextActive: {
    color: '#1a1a2e',
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
    backgroundColor: '#fbbf24',
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
    color: '#1a1a2e',
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
    color: '#9ca3af',
    marginTop: 24,
  },
});
