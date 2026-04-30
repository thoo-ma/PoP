import { MaterialIcons } from '@expo/vector-icons'
import type { ComponentStory } from '@/components/dev/storyTypes'
import EmptyState from '@/components/shared/EmptyState'
import { Button } from '@/components/ui'

export const emptyStateStories: ComponentStory = {
  componentName: 'EmptyState',
  description:
    'Empty/placeholder state with icon, title, description, and optional action. Supports inline and screen layouts.',
  groups: [
    {
      title: 'Layouts',
      items: [
        {
          label: 'Inline (default)',
          render: () => (
            <EmptyState
              title="No items found"
              description="Try adjusting your filters or check back later."
            />
          ),
        },
        {
          label: 'Screen',
          render: () => (
            <EmptyState
              layout="screen"
              title="No NFTs yet"
              description="Mint or breed your first NFT to get started."
            />
          ),
        },
      ],
    },
    {
      title: 'Icon + Action',
      layout: 'stack',
      items: [
        {
          label: 'With icon only',
          render: () => (
            <EmptyState
              icon={<MaterialIcons name="inbox" size={48} color="#9CA3AF" />}
              title="Inbox empty"
              description="You have no new notifications."
            />
          ),
        },
        {
          label: 'With action',
          render: () => (
            <EmptyState
              title="No results"
              description="Try a different search term."
              action={
                <Button variant="primary" size="sm">
                  <Button.Label>Clear filters</Button.Label>
                </Button>
              }
            />
          ),
        },
        {
          label: 'Full (icon + action)',
          render: () => (
            <EmptyState
              icon={<MaterialIcons name="search-off" size={48} color="#9CA3AF" />}
              title="Nothing to see"
              description="Get started by creating your first item."
              action={
                <Button variant="primary">
                  <Button.Label>Create</Button.Label>
                </Button>
              }
            />
          ),
        },
      ],
    },
  ],
}
