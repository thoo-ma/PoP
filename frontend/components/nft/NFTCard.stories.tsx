import { View } from 'react-native'
import type { ComponentStory } from '@/components/dev/storyTypes'
import NFTCard from '@/components/nft/NFTCard'
import { gridLayout } from '@/layouts'
import type { NFT } from '@/types'

const IMG = (color: string, label: string) =>
  `https://placehold.co/400x400/${color}/white?text=${encodeURIComponent(label)}`

const MOCK_NFT_COMMON: NFT = {
  id: 'dev-nft-common',
  name: 'toilet_mock_common',
  image_url: IMG('9CA3AF', 'Common'),
  blurhash: null,
  rarity: 'common',
  type: 'cruise-seat',
  level: 3,
  xp: 45,
  efficiency: 50,
  resilience: 45,
  comfort: 40,
  luck: 35,
  energy: 60,
  breed_count: 0,
  stat_points: 0,
  isListed: false,
  created_at: '2026-01-01T00:00:00Z',
  last_used_at: null,
  updated_at: '2026-01-01T00:00:00Z',
}

const MOCK_NFT_RARE: NFT = {
  ...MOCK_NFT_COMMON,
  id: 'dev-nft-rare',
  name: 'toilet_mock_rare',
  image_url: IMG('8B5CF6', 'Rare'),
  rarity: 'rare',
  type: 'turbo-flush',
  level: 5,
  xp: 120,
  efficiency: 72,
  resilience: 68,
  comfort: 55,
  luck: 43,
  energy: 80,
}

const MOCK_NFT_LEGENDARY: NFT = {
  ...MOCK_NFT_COMMON,
  id: 'dev-nft-legendary',
  name: 'toilet_mock_legendary',
  image_url: IMG('F59E0B', 'Legendary'),
  rarity: 'legendary',
  type: 'zen-fortress',
  level: 12,
  xp: 340,
  efficiency: 85,
  resilience: 82,
  comfort: 78,
  luck: 75,
  energy: 90,
}

const MOCK_NFT_TRANSCENDENT: NFT = {
  ...MOCK_NFT_COMMON,
  id: 'dev-nft-transcendent',
  name: 'toilet_mock_transcendent',
  image_url: IMG('EC4899', 'Transcend'),
  rarity: 'transcendent',
  type: 'turbo-flush',
  level: 18,
  xp: 620,
  efficiency: 95,
  resilience: 92,
  comfort: 88,
  luck: 85,
  energy: 100,
}

export const nftCardStories: ComponentStory = {
  componentName: 'NFTCard',
  description: 'Grid card showing NFT image, badges, stats, and XP bar. 4 rarities.',
  groups: [
    {
      title: 'Rarities',
      items: [
        {
          label: '2×2 grid',
          render: () => {
            const gl = gridLayout()
            return (
              <View className="w-full">
                <View className={gl.row()}>
                  <View className={gl.item()}>
                    <NFTCard nft={MOCK_NFT_COMMON} />
                  </View>
                  <View className={gl.item()}>
                    <NFTCard nft={MOCK_NFT_RARE} />
                  </View>
                </View>
                <View className={gl.row()}>
                  <View className={gl.item()}>
                    <NFTCard nft={MOCK_NFT_LEGENDARY} />
                  </View>
                  <View className={gl.item()}>
                    <NFTCard nft={MOCK_NFT_TRANSCENDENT} />
                  </View>
                </View>
              </View>
            )
          },
        },
      ],
    },
  ],
}
