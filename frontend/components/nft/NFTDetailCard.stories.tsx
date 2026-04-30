import type { ComponentStory } from '@/components/dev/storyTypes'
import NFTDetailCard from '@/components/nft/NFTDetailCard'
import type { NFT } from '@/types'

const IMG = (color: string, label: string) =>
  `https://placehold.co/400x400/${color}/white?text=${encodeURIComponent(label)}`

const MOCK_NFT: NFT = {
  id: 'dev-nft-detail',
  name: 'toilet_mock_detail',
  image_url: IMG('8B5CF6', 'Detail'),
  blurhash: null,
  rarity: 'rare',
  type: 'turbo-flush',
  level: 8,
  xp: 200,
  efficiency: 72,
  resilience: 68,
  comfort: 55,
  luck: 43,
  energy: 80,
  breed_count: 2,
  stat_points: 0,
  isListed: false,
  created_at: '2026-01-01T00:00:00Z',
  last_used_at: null,
  updated_at: '2026-01-01T00:00:00Z',
}

export const nftDetailCardStories: ComponentStory = {
  componentName: 'NFTDetailCard',
  description:
    'Detail card with NFT image, level/type badges, name, and stat bars. Overridable energy display.',
  groups: [
    {
      title: 'Variants',
      items: [
        {
          label: 'Default',
          render: () => <NFTDetailCard nft={MOCK_NFT} />,
        },
        {
          label: 'Override energy',
          render: () => <NFTDetailCard nft={MOCK_NFT} energy={45} />,
        },
      ],
    },
  ],
}
