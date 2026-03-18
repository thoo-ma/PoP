import { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights, radii } from '@/constants';

interface Props {
  visible: boolean;
  onSubmit: (password: string) => void;
  onCancel: () => void;
}

export default function PasswordPromptModal({ visible, onSubmit, onCancel }: Props) {
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    onSubmit(password);
    setPassword('');
  };

  const handleCancel = () => {
    setPassword('');
    onCancel();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          <Text style={modalStyles.title}>Dev Mode</Text>
          <Text style={modalStyles.subtitle}>Enter password to continue</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="Password"
            placeholderTextColor={colors.textLight}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoFocus
          />
          <View style={modalStyles.buttons}>
            <TouchableOpacity style={modalStyles.cancelButton} onPress={handleCancel}>
              <Text style={modalStyles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={modalStyles.submitButton} onPress={handleSubmit}>
              <Text style={modalStyles.submitText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.bgOverlayDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.bgSurface,
    borderRadius: radii.md,
    padding: spacing.xl,
    width: '80%',
    maxWidth: 320,
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.base,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    padding: spacing.md,
    fontSize: fontSizes.base,
    marginBottom: spacing.base,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  cancelButton: {
    padding: spacing.md,
    borderRadius: radii.sm,
  },
  cancelText: {
    fontSize: fontSizes.base,
    color: colors.text,
  },
  submitButton: {
    backgroundColor: colors.buttonPrimary,
    padding: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.sm,
  },
  submitText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.buttonText,
  },
});
