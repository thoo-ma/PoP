import { cn } from 'heroui-native'
import { Image, Text, View } from 'react-native'
import { badgeLabel, nftDetailCard, overlayBadge, typeBadge } from '@/styles'
import type { NFT } from '@/types'
import { formatDisplayName } from '@/utils'
import NFTProperties from './NFTProperties'

interface NFTDetailCardProps {
  nft: NFT
  /** Override energy value shown in the stat bar. Defaults to `nft.energy`. */
  energy?: number
}

export default function NFTDetailCard({ nft, energy }: NFTDetailCardProps) {
  const s = nftDetailCard()
  return (
    <View className={cn(s.root(), 'w-70 bg-surface border-outline')}>
      <View className={s.imageWrap()}>
        <Image source={{ uri: nft.image_url }} className={s.image()} resizeMode="cover" />
        <View className={cn(overlayBadge({ position: 'topLeft' }), 'bg-badge-level')}>
          <Text className={cn(badgeLabel(), 'tracking-wide')}>Lv {nft.level}</Text>
        </View>
        <View className={cn(overlayBadge({ position: 'topRight' }), typeBadge({ type: nft.type }))}>
          <Text className={cn(badgeLabel({ size: 'sm' }), 'tracking-wide')}>
            {nft.type.toUpperCase()}
          </Text>
        </View>
      </View>

      <View className={cn(s.content(), 'p-4')}>
        <Text className={cn(s.title(), 'text-on-surface mb-3')}>{formatDisplayName(nft.name)}</Text>
        <NFTProperties
          efficiency={nft.efficiency}
          resilience={nft.resilience}
          comfort={nft.comfort}
          luck={nft.luck}
          energy={energy ?? nft.energy}
          mode="compact"
        />
      </View>
    </View>
  )
}
