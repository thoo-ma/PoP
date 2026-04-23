import { useRef, useState } from 'react'
import { View } from 'react-native'
import { TactileButton } from '@/components/shared'
import { cn, Dialog } from '@/components/ui'
import { dialogBody, signOutModal } from '@/styles'

/**
 * Hook providing a declarative sign-out confirmation dialog.
 * Returns { show, dialog } where show(onConfirm) opens the dialog
 * and dialog is the JSX element to render in the component tree.
 */
export function useSignOutDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const onConfirmRef = useRef<(() => void | Promise<void>) | null>(null)

  const show = (onConfirm: () => void | Promise<void>) => {
    onConfirmRef.current = onConfirm
    setIsOpen(true)
  }

  const handleConfirm = async () => {
    setIsOpen(false)
    if (onConfirmRef.current) {
      await onConfirmRef.current()
    }
  }

  const s = signOutModal()
  const dialog = (
    <Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className={s.content()}>
          <Dialog.Close
            variant="ghost"
            feedbackVariant="none"
            className={cn(
              'h-control-md rounded-full bg-surface active:bg-surface',
              'border-tactile-sm border-border border-b-raise active:border-b-press active:translate-y-[3px]',
              'flex-row items-center justify-center',
              'self-start w-10 px-0',
            )}
          />
          <View className={dialogBody()}>
            <Dialog.Description>Are you sure you want to sign out?</Dialog.Description>
          </View>
          <View className={s.buttonRow()}>
            <TactileButton variant="outline" onPress={() => setIsOpen(false)} className="flex-1">
              Cancel
            </TactileButton>
            <TactileButton variant="default" onPress={handleConfirm} className="flex-1">
              Sign Out
            </TactileButton>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )

  return { dialog, show }
}
