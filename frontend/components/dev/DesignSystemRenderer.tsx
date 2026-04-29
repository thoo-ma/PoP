import type { ReactNode } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { Button } from '@/components/ui'
import type { ComponentStory } from './storyTypes'

function getStory(key: string): ComponentStory | null {
  switch (key) {
    case 'ds:button':
      return (require('@/components/ui/Button.stories') as { buttonStories: ComponentStory })
        .buttonStories
    default:
      return null
  }
}

function PreviewShell({ children, onBack }: { children: ReactNode; onBack: () => void }) {
  return (
    <View className="flex-1">
      {children}
      <View className="absolute bottom-32 left-6 right-6">
        <Button variant="primary" onPress={onBack} className="w-full">
          <Button.Label>← Back to Catalog</Button.Label>
        </Button>
      </View>
    </View>
  )
}

export function renderDesignSystem(key: string, dismiss: () => void): ReactNode {
  const story = getStory(key)
  if (!story) {
    return (
      <PreviewShell onBack={dismiss}>
        <View className="flex-1 items-center justify-center">
          <Text className="text-foreground font-bold">Unknown component: {key}</Text>
        </View>
      </PreviewShell>
    )
  }

  return (
    <PreviewShell onBack={dismiss}>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="p-4 pb-52 gap-8"
        showsVerticalScrollIndicator={false}
      >
        {story.description && (
          <Text className="text-sm text-muted text-center px-4">{story.description}</Text>
        )}

        {story.groups.map((group) => (
          <View key={group.title} className="gap-3">
            <Text className="text-xs font-black text-muted uppercase tracking-wider px-1">
              {group.title}
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {group.items.map((item) => (
                <View key={item.label} className="items-center gap-2">
                  {item.render()}
                  <Text className="text-xs text-muted text-center">{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Bottom spacing helps last items clear the back button */}
        <View className="h-32" />
      </ScrollView>
    </PreviewShell>
  )
}
