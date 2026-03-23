import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { Button, Dialog, TextField, Input, Label } from 'heroui-native';

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
    <Dialog isOpen={visible} onOpenChange={(open) => { if (!open) handleCancel(); }}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Dialog.Content>
            <Dialog.Close />
            <View className="mb-5 gap-1.5">
              <Dialog.Title>Dev Mode</Dialog.Title>
              <Dialog.Description>Enter password to continue</Dialog.Description>
            </View>
            <TextField className="mb-4">
              <Label>Password</Label>
              <Input
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                autoFocus
              />
            </TextField>
            <View className="flex-row justify-end gap-3">
              <Button variant="ghost" size="sm" onPress={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onPress={handleSubmit}>
                Continue
              </Button>
            </View>
          </Dialog.Content>
        </KeyboardAvoidingView>
      </Dialog.Portal>
    </Dialog>
  );
}
