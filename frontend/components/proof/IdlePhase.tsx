import { Button, cn } from 'heroui-native'
import { Text, View } from 'react-native'
import { NFTDetailCard, NFTSelector } from '@/components'
import {
  nftPickerButton,
  nftPickerPlaceholder,
  tactileButton,
  tactileButtonText,
  toastBanner,
} from '@/styles'
import type { NFT } from '@/types'

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
            <NFTDetailCard nft={displayNFT} />
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
