import { View } from 'react-native'
import { LootRouletteCard } from '@/components/nft'
import { phaseContainer } from '@/styles'
import type { NFT } from '@/types'
import { ChallengeHeader } from './ChallengeHeader'

type Props = {
  nft: NFT
  lootRollId: string
  onDone: () => void
}

export function RoulettePhase({ nft, lootRollId, onDone }: Props) {
  return (
    <View className={phaseContainer()}>
      <ChallengeHeader nft={nft} />
      <LootRouletteCard lootRollId={lootRollId} onDone={onDone} />
    </View>
  )
}
