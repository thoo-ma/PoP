import { Text, View } from 'react-native'
import type { ComponentStory } from '@/components/dev/storyTypes'
import { Button, Card } from '@/components/ui'

export const cardStories: ComponentStory = {
  componentName: 'Card',
  description:
    'Brand-baked card with rounded corners and hairline border. Compound parts: Header, Body, Footer, Title, Description.',
  groups: [
    {
      title: 'Body Content',
      items: [
        {
          label: 'Text',
          render: () => (
            <Card className="p-4">
              <Text className="text-foreground text-sm">A simple card with text content.</Text>
            </Card>
          ),
        },
        {
          label: 'Title',
          render: () => (
            <Card>
              <Card.Body>
                <Card.Title>Card Title</Card.Title>
              </Card.Body>
            </Card>
          ),
        },
        {
          label: 'Title + Desc',
          render: () => (
            <Card>
              <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Description>
                  Supporting description text that adds context to the title above.
                </Card.Description>
              </Card.Body>
            </Card>
          ),
        },
      ],
    },
    {
      title: 'Compound',
      items: [
        {
          label: 'Header + Body',
          render: () => (
            <Card>
              <Card.Header className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-muted" />
                <View className="flex-1">
                  <Text className="text-sm font-bold text-foreground">Header content</Text>
                  <Text className="text-xs text-muted">Metadata or subtitle</Text>
                </View>
              </Card.Header>
              <Card.Body>
                <Card.Title>Compound Card</Card.Title>
                <Card.Description>Body content below the header section.</Card.Description>
              </Card.Body>
            </Card>
          ),
        },
        {
          label: 'Body + Footer',
          render: () => (
            <Card>
              <Card.Body>
                <Card.Title>Card with Footer</Card.Title>
                <Card.Description>
                  Use the footer for action buttons or secondary info.
                </Card.Description>
              </Card.Body>
              <Card.Footer className="flex-row gap-2">
                <Button variant="secondary" size="sm">
                  <Button.Label>Cancel</Button.Label>
                </Button>
                <Button variant="primary" size="sm">
                  <Button.Label>Confirm</Button.Label>
                </Button>
              </Card.Footer>
            </Card>
          ),
        },
        {
          label: 'Full',
          render: () => (
            <Card>
              <Card.Header className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-muted" />
                <View className="flex-1">
                  <Text className="text-sm font-bold text-foreground">Profile</Text>
                  <Text className="text-xs text-muted">Last updated 2h ago</Text>
                </View>
              </Card.Header>
              <Card.Body>
                <Card.Title>Full Card</Card.Title>
                <Card.Description>
                  Header + Body (Title, Description) + Footer. All compound parts in use.
                </Card.Description>
              </Card.Body>
              <Card.Footer className="flex-row gap-2">
                <Button variant="secondary" size="sm">
                  <Button.Label>Dismiss</Button.Label>
                </Button>
                <Button variant="primary" size="sm">
                  <Button.Label>Action</Button.Label>
                </Button>
              </Card.Footer>
            </Card>
          ),
        },
      ],
    },
    {
      title: 'Wrapper Patterns',
      items: [
        {
          label: 'Stats row',
          render: () => (
            <Card className="p-4">
              <View className="flex-row items-center justify-around">
                <View className="items-center">
                  <Text className="text-2xl font-black text-foreground">42</Text>
                  <Text className="text-xs text-muted mt-1">Detections</Text>
                </View>
                <View className="w-px h-8 bg-border" />
                <View className="items-center">
                  <Text className="text-2xl font-black text-foreground">12</Text>
                  <Text className="text-xs text-muted mt-1">NFTs</Text>
                </View>
                <View className="w-px h-8 bg-border" />
                <View className="items-center">
                  <Text className="text-2xl font-black text-foreground">7</Text>
                  <Text className="text-xs text-muted mt-1">Days Active</Text>
                </View>
              </View>
            </Card>
          ),
        },
        {
          label: 'Balance card',
          render: () => (
            <Card className="p-5 items-center">
              <Text className="text-xs font-bold text-muted uppercase tracking-wider">
                POOP Balance
              </Text>
              <Text className="text-3xl font-black text-foreground mt-2">
                1,337 <Text className="text-sm text-muted">POOP</Text>
              </Text>
            </Card>
          ),
        },
      ],
    },
  ],
}
