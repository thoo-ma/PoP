import BreedParentSlot from '@/components/breed/BreedParentSlot'
import type { ComponentStory } from '@/components/dev/storyTypes'
import type { NFT } from '@/types'

const IMG = (color: string, label: string) =>
  `https://placehold.co/400x400/${color}/white?text=${encodeURIComponent(label)}`

const MOCK_NFT: NFT = {
  id: 'dev-nft-parent',
  name: 'toilet_mock_parent',
  image_url: IMG('8B5CF6', 'Parent'),
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

export const breedParentSlotStories: ComponentStory = {
  componentName: 'BreedParentSlot',
  description: 'Tappable breed parent slot. Shows selected NFT or empty placeholder.',
  groups: [
    {
      title: 'States',
      layout: 'stack',
      items: [
        {
          label: 'Empty',
          render: () => <BreedParentSlot nft={null} label="Parent 1" onPress={() => {}} />,
        },
        {
          label: 'Filled',
          render: () => <BreedParentSlot nft={MOCK_NFT} label="Parent 1" onPress={() => {}} />,
        },
      ],
    },
  ],
}
