import { StyleSheet } from 'react-native';
import { colors, typography, layout } from '../constants';

export const styles = StyleSheet.create({
  container: {
    ...layout.container,
    backgroundColor: colors.immobilityBackground,
  },
  title: {
    ...typography.title,
    color: colors.immobilityTitle,
  },
  description: {
    ...typography.description,
    color: colors.immobilityText,
  },
  card: {
    marginBottom: 24,
  },
  modeContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  modeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.immobilityText,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: colors.immobilityCard,
    minWidth: 120,
    alignItems: 'center',
  },
  modeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    backgroundColor: colors.immobilityCard,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 32,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonStop: {
    backgroundColor: '#ff6b6b',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  hint: {
    ...typography.hint,
    color: colors.immobilityHint,
  },
});
