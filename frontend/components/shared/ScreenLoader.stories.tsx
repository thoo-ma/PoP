import { View } from 'react-native'
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
          render: () => (
            <View className="h-32">
              <ScreenLoader />
            </View>
          ),
        },
        {
          label: 'With title',
          render: () => (
            <View className="h-32">
              <ScreenLoader title="Loading NFTs..." />
            </View>
          ),
        },
        {
          label: 'With title + message',
          render: () => (
            <View className="h-32">
              <ScreenLoader
                title="Syncing data"
                message="Please wait while we update your collection."
              />
            </View>
          ),
        },
      ],
    },
  ],
}
