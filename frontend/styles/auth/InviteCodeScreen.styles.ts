import { StyleSheet } from 'react-native';
import { colors } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
  },
  input: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 4,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    textTransform: 'uppercase',
    backgroundColor: colors.bgLighter,
  },
  inputFocused: {
    borderColor: colors.info,
    backgroundColor: colors.bgSurface,
  },
  inputError: {
    borderColor: colors.errorLight,
  },
  submitButton: {
    backgroundColor: colors.info,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: colors.disabled,
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.buttonText,
    fontSize: 18,
    fontWeight: '600',
  },
  signOutButton: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  signOutButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: colors.errorBg,
    borderWidth: 1,
    borderColor: colors.errorLight,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  errorText: {
    color: colors.errorDark,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  loadingContainer: {
    marginBottom: 16,
  },
  helperText: {
    fontSize: 12,
    color: colors.disabled,
    textAlign: 'center',
    marginTop: -8,
    marginBottom: 24,
  },
});
