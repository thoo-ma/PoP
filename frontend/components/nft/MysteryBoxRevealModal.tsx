import { memo } from 'react'
import { Button, Dialog } from '@/components/ui'
import { NFTDetailCard } from '@/components/nft'
import { revealModal } from '@/layouts'
import type { OpenMysteryBoxResponse } from '@pop/shared'
import type { NFT } from '@/types'

interface MysteryBoxRevealModalProps {
  isVisible: boolean
  /** The newly minted toilet NFT — must be non-null when `isVisible` is true. */
  nft: OpenMysteryBoxResponse | null
  onDismiss: () => void
}

/**
 * Celebrate the result of opening a mystery box.
 * Displays the newly minted toilet via NFTDetailCard.
 */
export default memo(function MysteryBoxRevealModal({
  isVisible,
  nft,
  onDismiss,
}: MysteryBoxRevealModalProps) {
  if (!nft) return null

  const s = revealModal()
  return (
    <Dialog
      isOpen={isVisible}
      onOpenChange={(open) => {
        if (!open) onDismiss()
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className={s.content()}>
          <Dialog.Title className={s.titleLg()}>New NFT!</Dialog.Title>

          <NFTDetailCard nft={nft as NFT} />

          <Button
            variant="primary"
            onPress={onDismiss}
            className="w-full mt-4"
            accessibilityLabel="Close reveal and return to vault"
          >
            <Button.Label>View in Vault</Button.Label>
          </Button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
})
