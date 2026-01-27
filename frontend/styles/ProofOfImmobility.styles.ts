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
