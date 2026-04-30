import type { ComponentStory } from '@/components/dev/storyTypes'
import ScreenError from '@/components/shared/ScreenError'

export const screenErrorStories: ComponentStory = {
  componentName: 'ScreenError',
  description: 'Full-screen centered error alert with optional retry button.',
  groups: [
    {
      title: 'Variants',
      layout: 'stack',
      items: [
        {
          label: 'Without retry',
          render: () => (
            <ScreenError
              title="Something went wrong"
              message="We encountered an unexpected error. Please try again later."
            />
          ),
        },
        {
          label: 'With retry',
          render: () => (
            <ScreenError
              title="Connection lost"
              message="Unable to reach the server. Check your connection and try again."
              onRetry={() => {}}
            />
          ),
        },
      ],
    },
  ],
}
