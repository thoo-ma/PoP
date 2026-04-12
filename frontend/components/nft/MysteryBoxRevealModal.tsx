import { Button, cn, Dialog } from 'heroui-native'
import { memo } from 'react'
import { Image, Text, View } from 'react-native'
import { rarityBadge, revealModal, tactileButton, tactileButtonText } from '@/styles'
import type { NFT } from '@/types/nft'
import { formatDisplayName } from '@/utils'

interface MysteryBoxRevealModalProps {
  visible: boolean
  /** The newly minted toilet NFT — must be non-null when `visible` is true. */
  nft: NFT | null
  onClose: () => void
}

/**
 * Celebrate the result of opening a mystery box.
 * Displays the newly minted toilet's image, name and rarity,
 * then lets the user dismiss to return to the vault.
 */
export default memo(function MysteryBoxRevealModal({
  visible,
  nft,
  onClose,
}: MysteryBoxRevealModalProps) {
  if (!nft) return null

  const s = revealModal()
  return (
    <Dialog
      isOpen={visible}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className={s.content()}>
          <Dialog.Title className={s.titleLg()}>You got a toilet!</Dialog.Title>
          <Dialog.Description className={s.description()}>
            Your mystery box has been opened
          </Dialog.Description>

          <View className={s.imageContainer()}>
            <Image source={{ uri: nft.image_url }} className="w-full h-full" resizeMode="cover" />
            <View className={cn(s.rarityOverlay(), rarityBadge({ rarity: nft.rarity }))}>
              <Text className={s.rarityText()}>{nft.rarity.toUpperCase()}</Text>
            </View>
          </View>

          <Text className={s.titleMd()}>{formatDisplayName(nft.name)}</Text>
          <Text className={cn(s.description(), 'capitalize')}>{nft.type.replace(/-/g, ' ')}</Text>

          <Button
            variant="ghost"
            feedbackVariant="none"
            onPress={onClose}
            className={cn(tactileButton({ variant: 'primary' }), 'w-full')}
            accessibilityLabel="Close reveal and return to vault"
          >
            <Button.Label className={tactileButtonText({ variant: 'primary' })}>
              View in Vault
            </Button.Label>
          </Button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
})
