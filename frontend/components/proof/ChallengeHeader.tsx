import { Avatar } from 'heroui-native'
import { Text, View } from 'react-native'
import { challengeHeader } from '@/styles'
import type { NFT } from '@/types'
import { formatDisplayName } from '@/utils'

type Props = {
  nft: NFT
}

export function ChallengeHeader({ nft }: Props) {
  const headerStyles = challengeHeader()
  return (
    <View className={headerStyles.root()}>
      <Avatar size="lg" alt={formatDisplayName(nft.name)} className={headerStyles.avatar()}>
        <Avatar.Image source={{ uri: nft.image_url }} />
        <Avatar.Fallback>{formatDisplayName(nft.name).charAt(0)}</Avatar.Fallback>
      </Avatar>
      <View className={headerStyles.info()}>
        <Text className={headerStyles.name()}>{formatDisplayName(nft.name)}</Text>
        <Text className={headerStyles.subtitle()}>
          Lv {nft.level} · {nft.type}
        </Text>
      </View>
    </View>
  )
}
