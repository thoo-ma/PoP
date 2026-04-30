import { Text, View } from 'react-native'
import type { ComponentStory } from '@/components/dev/storyTypes'
import { PressableFeedback } from '@/components/ui'

export const pressableFeedbackStories: ComponentStory = {
  componentName: 'PressableFeedback',
  description: 'Touch feedback wrapper. 3 variants: scale, highlight, and ripple.',
  groups: [
    {
      title: 'Compound Parts',
      items: [
        {
          label: 'Scale',
          render: () => (
            <PressableFeedback.Scale>
              <View className="bg-surface-secondary px-6 py-4 rounded-frame border border-border">
                <Text className="text-foreground font-bold">Scale</Text>
              </View>
            </PressableFeedback.Scale>
          ),
        },
        {
          label: 'Highlight',
          render: () => (
            <PressableFeedback.Highlight>
              <View className="bg-surface-secondary px-6 py-4 rounded-frame border border-border">
                <Text className="text-foreground font-bold">Highlight</Text>
              </View>
            </PressableFeedback.Highlight>
          ),
        },
        {
          label: 'Ripple',
          render: () => (
            <PressableFeedback.Ripple>
              <View className="bg-surface-secondary px-6 py-4 rounded-frame border border-border">
                <Text className="text-foreground font-bold">Ripple</Text>
              </View>
            </PressableFeedback.Ripple>
          ),
        },
      ],
    },
  ],
}
