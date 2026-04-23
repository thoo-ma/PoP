import { memo, type ReactElement } from 'react'
import { Text, View } from 'react-native'
import { NFTDetailCard, NFTSelector } from '@/components/nft'
import { Button } from '@/components/ui'
import { nftPickerButton, nftPickerSlot } from '@/styles'
import type { NFT } from '@/types'
import AlertFrame from '../shared/AlertFrame'

type Props = {
  nft: { nfts: NFT[]; selectedIndex: number | null; displayNFT: NFT | null }
  ui: {
    buttonDisabled: boolean
    buttonLabel: string | ReactElement
    immobilityMessage: string | null
  }
  a11y: { label?: string; hint: string }
  handlers: { onSelectNFT: () => void; onPrev: () => void; onNext: () => void; onPoop: () => void }
}

export const IdlePhase = memo(function IdlePhase({ nft, ui, a11y, handlers }: Props) {
  const { nfts, selectedIndex, displayNFT } = nft
  const { buttonDisabled, buttonLabel, immobilityMessage } = ui
  const { onSelectNFT, onPrev, onNext, onPoop } = handlers
  const ph = nftPickerSlot()
  return (
    <>
      {immobilityMessage && (
        <AlertFrame status="warning" description={immobilityMessage} className="mb-2" />
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
        variant="primary"
        onPress={onPoop}
        isDisabled={buttonDisabled}
        className="px-12"
        {...(a11y.label !== undefined ? { accessibilityLabel: a11y.label } : {})}
        accessibilityHint={a11y.hint}
      >
        {typeof buttonLabel === 'string' ? <Button.Label>{buttonLabel}</Button.Label> : buttonLabel}
      </Button>
    </>
  )
})
