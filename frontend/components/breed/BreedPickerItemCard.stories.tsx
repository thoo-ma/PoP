import { View } from 'react-native'
import BreedPickerItemCard from '@/components/breed/BreedPickerItemCard'
import type { ComponentStory } from '@/components/dev/storyTypes'
import type { NFT } from '@/types'

const IMG = (color: string, label: string) =>
  `https://placehold.co/400x400/${color}/white?text=${encodeURIComponent(label)}`

const MOCK_NFT: NFT = {
  id: 'dev-nft-picker',
  name: 'toilet_mock_picker',
  image_url: IMG('8B5CF6', 'Picker'),
  blurhash: null,
  rarity: 'rare',
  type: 'turbo-flush',
  level: 5,
  xp: 120,
  efficiency: 72,
  resilience: 68,
  comfort: 55,
  luck: 43,
  energy: 80,
  breed_count: 1,
  stat_points: 0,
  isListed: false,
  created_at: '2026-01-01T00:00:00Z',
  last_used_at: null,
  updated_at: '2026-01-01T00:00:00Z',
}

export const breedPickerItemCardStories: ComponentStory = {
  componentName: 'BreedPickerItemCard',
  description: 'NFT picker card for breed parent selection. Normal, selected, and disabled states.',
  groups: [
    {
      title: 'States',
      items: [
        {
          label: 'Normal',
          render: () => (
            <View className="w-40">
              <BreedPickerItemCard
                nft={MOCK_NFT}
                disabled={false}
                isSelected={false}
                width={160}
                onPress={() => {}}
              />
            </View>
          ),
        },
        {
          label: 'Selected',
          render: () => (
            <View className="w-40">
              <BreedPickerItemCard
                nft={MOCK_NFT}
                disabled
                isSelected
                width={160}
                onPress={() => {}}
              />
            </View>
          ),
        },
        {
          label: 'Disabled',
          render: () => (
            <View className="w-40">
              <BreedPickerItemCard
                nft={MOCK_NFT}
                disabled
                isSelected={false}
                width={160}
                onPress={() => {}}
              />
            </View>
          ),
        },
      ],
    },
  ],
}
