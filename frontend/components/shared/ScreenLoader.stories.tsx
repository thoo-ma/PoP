import type { ComponentStory } from '@/components/dev/storyTypes'
import ScreenLoader from '@/components/shared/ScreenLoader'

export const screenLoaderStories: ComponentStory = {
  componentName: 'ScreenLoader',
  description:
    'Full-screen centered loading state with spinner. Bare, with title, or with title + message.',
  groups: [
    {
      title: 'Variants',
      items: [
        {
          label: 'Bare',
          render: () => <ScreenLoader />,
        },
        {
          label: 'With title',
          render: () => <ScreenLoader title="Loading NFTs..." />,
        },
        {
          label: 'With title + message',
          render: () => (
            <ScreenLoader
              title="Syncing data"
              message="Please wait while we update your collection."
            />
          ),
        },
      ],
    },
  ],
}
