import { cn, Dialog } from 'heroui-native'
import { memo } from 'react'
import { Text, View } from 'react-native'
import { RemoteImage } from '@/components/styled'
import { rarityBadge, revealModal } from '@/styles'
import type { NFT } from '@/types'
import { formatDisplayName } from '@/utils'
import TactileButton from '../shared/TactileButton'

interface MysteryBoxRevealModalProps {
  isVisible: boolean
  /** The newly minted toilet NFT — must be non-null when `isVisible` is true. */
  nft: NFT | null
  onDismiss: () => void
}

/**
 * Celebrate the result of opening a mystery box.
 * Displays the newly minted toilet's image, name and rarity,
 * then lets the user dismiss to return to the vault.
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
          <Dialog.Title className={s.titleLg()}>You got a toilet!</Dialog.Title>
          <Dialog.Description className={s.description()}>
            Your mystery box has been opened
          </Dialog.Description>

          <View className={s.imageContainer()}>
            <RemoteImage
              source={{ uri: nft.image_url }}
              blurhash={nft.blurhash ?? undefined}
              className="w-full h-full"
              contentFit="cover"
              accessible={false}
            />
            <View className={cn(s.rarityOverlay(), rarityBadge({ rarity: nft.rarity }))}>
              <Text className={s.rarityText()}>{nft.rarity.toUpperCase()}</Text>
            </View>
          </View>

          <Text className={s.titleMd()}>{formatDisplayName(nft.name)}</Text>
          <Text className={cn(s.description(), 'capitalize')}>{nft.type.replace(/-/g, ' ')}</Text>

          <TactileButton
            variant="primary"
            onPress={onDismiss}
            className="w-full"
            accessibilityLabel="Close reveal and return to vault"
          >
            View in Vault
          </TactileButton>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
})
