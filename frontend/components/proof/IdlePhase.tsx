import { Button, cn } from 'heroui-native'
import { Image, Text, View } from 'react-native'
import NFTProperties from '@/components/nft/NFTProperties'
import NFTSelector from '@/components/nft/NFTSelector'
import {
  badgeLabel,
  nftDetailCard,
  nftPickerButton,
  nftPickerPlaceholder,
  overlayBadge,
  tactileButton,
  tactileButtonText,
  toastBanner,
  typeBadge,
} from '@/styles'
import type { NFT } from '@/types'
import { formatDisplayName } from '@/utils'

type Props = {
  nfts: NFT[]
  selectedIndex: number | null
  displayNFT: NFT | null
  buttonDisabled: boolean
  buttonLabel: string
  accessibilityLabel: string
  accessibilityHint: string
  immobilityMessage: string | null
  onSelectNFT: () => void
  onPrev: () => void
  onNext: () => void
  onPoop: () => void
}

export function IdlePhase({
  nfts,
  selectedIndex,
  displayNFT,
  buttonDisabled,
  buttonLabel,
  accessibilityLabel,
  accessibilityHint,
  immobilityMessage,
  onSelectNFT,
  onPrev,
  onNext,
  onPoop,
}: Props) {
  const toastStyles = toastBanner()
  const detailStyles = nftDetailCard()
  const ph = nftPickerPlaceholder()
  return (
    <>
      {immobilityMessage && (
        <View className={toastStyles.root()}>
          <Text className={toastStyles.label()}>{immobilityMessage}</Text>
        </View>
      )}

      <View className="w-full items-center mb-5">
        {selectedIndex === null || !displayNFT ? (
          <Button
            variant="ghost"
            feedbackVariant="none"
            onPress={onSelectNFT}
            isDisabled={nfts.length === 0}
            className={nftPickerButton()}
          >
            <Text className={ph.icon()}>+</Text>
            <Button.Label className={ph.label()}>
              {nfts.length === 0 ? 'No NFTs Available' : 'Select NFT from Vault'}
            </Button.Label>
          </Button>
        ) : (
          <>
            <NFTSelector
              current={selectedIndex + 1}
              total={nfts.length}
              onPrev={onPrev}
              onNext={onNext}
              className="mb-3"
            />
            <View className={cn(detailStyles.root(), 'w-70 bg-surface border-outline')}>
              <View className={detailStyles.imageWrap()}>
                <Image
                  source={{ uri: displayNFT.image_url }}
                  className={detailStyles.image()}
                  resizeMode="cover"
                />
                <View className={cn(overlayBadge({ position: 'topLeft' }), 'bg-badge-level')}>
                  <Text className={cn(badgeLabel(), 'tracking-wide')}>Lv {displayNFT.level}</Text>
                </View>
                <View
                  className={cn(
                    overlayBadge({ position: 'topRight' }),
                    typeBadge({ type: displayNFT.type }),
                  )}
                >
                  <Text className={cn(badgeLabel({ size: 'sm' }), 'tracking-wide')}>
                    {displayNFT.type.toUpperCase()}
                  </Text>
                </View>
              </View>
              <View className={cn(detailStyles.content(), 'p-4')}>
                <Text className={cn(detailStyles.title(), 'text-on-surface mb-3')}>
                  {formatDisplayName(displayNFT.name)}
                </Text>
                <NFTProperties
                  efficiency={displayNFT.efficiency}
                  resilience={displayNFT.resilience}
                  comfort={displayNFT.comfort}
                  luck={displayNFT.luck}
                  energy={displayNFT.energy}
                  mode="compact"
                />
              </View>
            </View>
          </>
        )}
      </View>

      <Button
        variant="ghost"
        feedbackVariant="none"
        onPress={onPoop}
        isDisabled={buttonDisabled}
        className={cn(tactileButton({ variant: 'primary' }), 'px-12')}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
      >
        <Button.Label className={tactileButtonText({ variant: 'primary' })}>
          {buttonLabel}
        </Button.Label>
      </Button>
    </>
  )
}
