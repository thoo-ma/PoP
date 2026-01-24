import { StyleSheet } from 'react-native';
import { colors, typography, layout } from '../constants';

export const styles = StyleSheet.create({
  container: {
    ...layout.container,
    backgroundColor: colors.homeBackground,
  },
  title: typography.title,
  email: {
    fontSize: 16,
    color: colors.homeText,
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.homeButton,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 48,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  hint: {
    ...typography.hint,
    color: colors.hint,
  },
});
