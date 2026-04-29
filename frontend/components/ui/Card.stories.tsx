import { Text, View } from 'react-native'
import type { ComponentStory } from '@/components/dev/storyTypes'
import { Button, Card, Chip, cn } from '@/components/ui'
import {
  cardBody,
  cardContainer,
  cardImageContainer,
  cardTitle,
  cardWrapper,
  nftDetailCard,
  xpBar,
} from '@/layouts'

export const cardStories: ComponentStory = {
  componentName: 'Card',
  description:
    'Brand-baked card (rounded-card + hairline border). Two patterns: Card‑only (Profile), and wrapper+container (grid cards, panels).',
  groups: [
    {
      title: 'Card‑only (Profile)',
      items: [
        {
          label: 'Stats row',
          render: () => (
            <Card className="bg-surface-secondary flex-row justify-around items-center w-full py-5 mb-6">
              <View className="flex-1 items-center">
                <Text className="text-heading-xs font-bold text-foreground">42</Text>
                <Text className="text-body-md font-bold text-muted mt-1">Detections</Text>
              </View>
              <View className="w-px h-8 bg-border" />
              <View className="flex-1 items-center">
                <Text className="text-heading-xs font-bold text-foreground">12</Text>
                <Text className="text-body-md font-bold text-muted mt-1">NFTs</Text>
              </View>
              <View className="w-px h-8 bg-border" />
              <View className="flex-1 items-center">
                <Text className="text-heading-xs font-bold text-foreground">7</Text>
                <Text className="text-body-md font-bold text-muted mt-1">Days</Text>
              </View>
            </Card>
          ),
        },
        {
          label: 'Balance',
          render: () => (
            <Card className="bg-surface-secondary w-full px-4 py-4 items-center mb-4">
              <Text className="text-body-md mb-1 font-bold text-muted">POOP Balance</Text>
              <Text className="text-heading-lg font-bold text-foreground">
                1,337 <Text className="text-heading-xs font-bold text-muted">POOP</Text>
              </Text>
            </Card>
          ),
        },
        {
          label: 'Action card',
          render: () => (
            <Card className="w-full">
              <Card.Body>
                <Card.Title>Action Card</Card.Title>
                <Card.Description>
                  Title + Description + Footer with buttons — no wrapper needed.
                </Card.Description>
              </Card.Body>
              <Card.Footer className="flex-row gap-2">
                <Button variant="secondary" size="sm">
                  <Button.Label>Dismiss</Button.Label>
                </Button>
                <Button variant="primary" size="sm">
                  <Button.Label>Confirm</Button.Label>
                </Button>
              </Card.Footer>
            </Card>
          ),
        },
      ],
    },
    {
      title: 'Grid Cards (wrapper + container)',
      items: [
        {
          label: 'NFTCard',
          render: () => (
            <View className={cardWrapper({ className: 'max-w-40' })}>
              <Card className={cardContainer()} animation="disable-all">
                <Card.Header className={cardImageContainer()}>
                  <View className="w-full h-full bg-surface-secondary items-center justify-center">
                    <Text className="text-muted text-body-sm font-bold">Image</Text>
                  </View>
                  <View className="absolute top-2 left-2 bg-stat-level px-1.5 py-0.5 rounded-tag">
                    <Text className="text-caption font-black text-white">Lv 5</Text>
                  </View>
                  <View className="absolute top-2 right-2 bg-accent px-1.5 py-0.5 rounded-tag">
                    <Text className="text-caption font-black text-white">TURBO</Text>
                  </View>
                  <View className="absolute bottom-2 left-2 bg-stat-efficiency px-1.5 py-0.5 rounded-tag">
                    <Text className="text-caption font-black text-white">RARE</Text>
                  </View>
                </Card.Header>
                <Card.Body className={cardBody()}>
                  <Card.Title className={cn(cardTitle(), 'min-h-8')}>Crypto Nibbler</Card.Title>
                  <View className={xpBar().row()}>
                    <Text className={xpBar().label()}>Lv</Text>
                    <View className={xpBar().track()}>
                      <View className="h-1 rounded-full bg-border">
                        <View className="h-1 w-[60%] rounded-full bg-stat-level" />
                      </View>
                    </View>
                    <Text className="text-body-sm font-bold text-stat-comfort">5</Text>
                  </View>
                </Card.Body>
              </Card>
            </View>
          ),
        },
        {
          label: 'Mystery Box',
          render: () => (
            <View className={cardWrapper({ className: 'max-w-40' })}>
              <Card className={cardContainer()} animation="disable-all">
                <Card.Header className={cardImageContainer()}>
                  <View className="w-full h-full bg-surface-secondary items-center justify-center">
                    <Text className="text-muted text-body-sm font-bold">Box</Text>
                  </View>
                </Card.Header>
                <Card.Body className={cardBody()}>
                  <View className="flex-row items-center gap-2">
                    <Chip size="sm" variant="primary" animation="disable-all">
                      <Chip.Label className="text-caption font-bold">×3</Chip.Label>
                    </Chip>
                    <Chip size="sm" variant="primary" animation="disable-all">
                      <Chip.Label className="text-caption font-bold">RARE</Chip.Label>
                    </Chip>
                  </View>
                </Card.Body>
              </Card>
            </View>
          ),
        },
      ],
    },
    {
      title: 'Panels',
      items: [
        {
          label: 'Outcome panel',
          render: () => (
            <View className="w-full mb-5 border-2 border-border rounded-frame">
              <Card className="overflow-hidden rounded-body" animation="disable-all">
                <Card.Body className="px-4 py-1.5">
                  <Card.Title className="text-body-sm font-bold uppercase tracking-widest mb-2">
                    Possible outcomes
                  </Card.Title>
                  {[
                    { rarity: 'Common', pct: 62, color: 'bg-stat-comfort' },
                    { rarity: 'Rare', pct: 30, color: 'bg-stat-efficiency' },
                    { rarity: 'Legendary', pct: 8, color: 'bg-stat-luck' },
                  ].map((r) => (
                    <View key={r.rarity} className="flex-row items-center mb-1 gap-2">
                      <Text className="text-body-sm text-foreground font-bold w-label-lg">
                        {r.rarity}
                      </Text>
                      <View className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                        <View
                          className={cn('h-full rounded-full', r.color)}
                          style={{ width: `${r.pct}%` }}
                        />
                      </View>
                      <Text className="text-body-md font-bold text-foreground w-11 text-right">
                        {r.pct}%
                      </Text>
                    </View>
                  ))}
                </Card.Body>
              </Card>
            </View>
          ),
        },
        {
          label: 'Detail card',
          render: () => (
            <View className={cardWrapper({ border: 'flat', className: 'w-70' })}>
              <Card className={cardContainer()} animation="disable-all">
                <Card.Header className={cn(cardImageContainer(), 'aspect-auto')}>
                  <View className={nftDetailCard().image()}>
                    <View className="w-full h-full bg-surface-secondary items-center justify-center">
                      <Text className="text-muted text-body-sm font-bold">NFT Image</Text>
                    </View>
                  </View>
                  <View className="absolute top-2 left-2 bg-stat-level px-1.5 py-0.5 rounded-tag">
                    <Text className="text-caption font-black text-white">Lv 8</Text>
                  </View>
                  <View className="absolute top-2 right-2 bg-accent px-1.5 py-0.5 rounded-tag">
                    <Text className="text-caption font-black text-white">CRUISE</Text>
                  </View>
                </Card.Header>
                <Card.Body className={nftDetailCard().body()}>
                  <Card.Title className={nftDetailCard().title()}>The Porcelain King</Card.Title>
                </Card.Body>
              </Card>
            </View>
          ),
        },
      ],
    },
  ],
}
