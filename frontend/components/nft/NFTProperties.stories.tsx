import type { ComponentStory } from '@/components/dev/storyTypes'
import NFTProperties from '@/components/nft/NFTProperties'

export const nftPropertiesStories: ComponentStory = {
  componentName: 'NFTProperties',
  description:
    'NFT stat bars (efficiency, resilience, comfort, luck) with optional energy. Compact and detailed modes.',
  groups: [
    {
      title: 'Modes',
      items: [
        {
          label: 'Compact',
          render: () => (
            <NFTProperties efficiency={72} resilience={68} comfort={55} luck={43} mode="compact" />
          ),
        },
        {
          label: 'Detailed',
          render: () => (
            <NFTProperties efficiency={72} resilience={68} comfort={55} luck={43} mode="detailed" />
          ),
        },
      ],
    },
    {
      title: 'With Energy',
      items: [
        {
          label: 'Compact + energy',
          render: () => (
            <NFTProperties
              efficiency={72}
              resilience={68}
              comfort={55}
              luck={43}
              energy={80}
              mode="compact"
            />
          ),
        },
        {
          label: 'Detailed + energy',
          render: () => (
            <NFTProperties
              efficiency={72}
              resilience={68}
              comfort={55}
              luck={43}
              energy={80}
              mode="detailed"
            />
          ),
        },
      ],
    },
    {
      title: 'With Excluded Properties',
      items: [
        {
          label: 'Compact (exclude Luck)',
          render: () => (
            <NFTProperties
              efficiency={72}
              resilience={68}
              comfort={55}
              luck={43}
              excludeProperties={['Luck']}
              mode="compact"
            />
          ),
        },
      ],
    },
  ],
}
