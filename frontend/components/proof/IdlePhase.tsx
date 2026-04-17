import { Alert, Button } from 'heroui-native'
import { Text, View } from 'react-native'
import { NFTDetailCard, NFTSelector } from '@/components'
import { nftPickerButton, nftPickerPlaceholder } from '@/styles'
import type { NFT } from '@/types'
import TactileButton from '../shared/TactileButton'

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
  const ph = nftPickerPlaceholder()
  return (
    <>
      {immobilityMessage && (
        <Alert
          status="warning"
          className="w-full rounded-2xl border-[3px] border-outline border-b-[5px] mb-2"
        >
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Description className="font-bold">{immobilityMessage}</Alert.Description>
          </Alert.Content>
        </Alert>
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

      <TactileButton
        variant="primary"
        onPress={onPoop}
        isDisabled={buttonDisabled}
        className="px-12"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
      >
        {buttonLabel}
      </TactileButton>
    </>
  )
}
