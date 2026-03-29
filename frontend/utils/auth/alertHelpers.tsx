import { useRef, useState } from "react";
import { View } from "react-native";
import { Button, Dialog } from "heroui-native";
import { dialogBody } from "@/styles";

/**
 * Hook providing a declarative sign-out confirmation dialog.
 * Returns { show, dialog } where show(onConfirm) opens the dialog
 * and dialog is the JSX element to render in the component tree.
 */
export function useSignOutDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const onConfirmRef = useRef<(() => void | Promise<void>) | null>(null);

  const show = (onConfirm: () => void | Promise<void>) => {
    onConfirmRef.current = onConfirm;
    setIsOpen(true);
  };

  const handleConfirm = async () => {
    setIsOpen(false);
    if (onConfirmRef.current) {
      await onConfirmRef.current();
    }
  };

  const dialog = (
    <Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Close />
          <View className={dialogBody()}>
            <Dialog.Title>Sign Out</Dialog.Title>
            <Dialog.Description>Are you sure you want to sign out?</Dialog.Description>
          </View>
          <View className="flex-row justify-end gap-3">
            <Button variant="tertiary" size="sm" onPress={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onPress={handleConfirm}>
              Sign Out
            </Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );

  return { dialog, show };
}
