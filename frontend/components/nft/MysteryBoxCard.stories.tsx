import type { MysteryBox, NFTRarity } from '@pop/shared'
import { View } from 'react-native'
import type { ComponentStory } from '@/components/dev/storyTypes'
import MysteryBoxCard from '@/components/nft/MysteryBoxCard'
import { gridLayout } from '@/layouts'

const IMG = (color: string, label: string) =>
  `https://placehold.co/400x400/${color}/white?text=${encodeURIComponent(label)}`

const mockBox = (rarity: NFTRarity): MysteryBox => ({
  id: `dev-box-${rarity}`,
  rarity,
  image_url: IMG(
    rarity === 'common'
      ? '9CA3AF'
      : rarity === 'rare'
        ? '8B5CF6'
        : rarity === 'legendary'
          ? 'F59E0B'
          : 'EC4899',
    `${rarity}\nBox`,
  ),
  blurhash: null,
  opened: false,
  created_at: '2026-01-01T00:00:00Z',
})

export const mysteryBoxCardStories: ComponentStory = {
  componentName: 'MysteryBoxCard',
  description:
    'Mystery box grid card with count and rarity badge. Shows available and empty states.',
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
                    <MysteryBoxCard
                      rarity="rare"
                      box={mockBox('rare')}
                      imageUrl={mockBox('rare').image_url}
                      count={3}
                    />
                  </View>
                  <View className={gl.item()}>
                    <MysteryBoxCard
                      rarity="legendary"
                      box={mockBox('legendary')}
                      imageUrl={mockBox('legendary').image_url}
                      count={1}
                    />
                  </View>
                </View>
                <View className={gl.row()}>
                  <View className={gl.item()}>
                    <MysteryBoxCard
                      rarity="common"
                      box={null}
                      imageUrl={IMG('9CA3AF', 'Common\nBox')}
                      count={0}
                    />
                  </View>
                  <View className={gl.item()}>
                    <MysteryBoxCard
                      rarity="transcendent"
                      box={null}
                      imageUrl={IMG('EC4899', 'Trans\nBox')}
                      count={0}
                    />
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
