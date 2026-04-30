import type { ReactNode } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { Button } from '@/components/ui'
import type { ComponentStory } from './storyTypes'

function getStory(key: string): ComponentStory | null {
  switch (key) {
    case 'ds:button':
      return (require('@/components/ui/Button.stories') as { buttonStories: ComponentStory })
        .buttonStories
    case 'ds:card':
      return (require('@/components/ui/Card.stories') as { cardStories: ComponentStory })
        .cardStories
    case 'ds:alert':
      return (require('@/components/ui/Alert.stories') as { alertStories: ComponentStory })
        .alertStories
    case 'ds:chip':
      return (require('@/components/ui/Chip.stories') as { chipStories: ComponentStory })
        .chipStories
    case 'ds:spinner':
      return (require('@/components/ui/Spinner.stories') as { spinnerStories: ComponentStory })
        .spinnerStories
    case 'ds:avatar':
      return (require('@/components/ui/Avatar.stories') as { avatarStories: ComponentStory })
        .avatarStories
    case 'ds:dialog':
      return (require('@/components/ui/Dialog.stories') as { dialogStories: ComponentStory })
        .dialogStories
    case 'ds:pressable-feedback':
      return (
        require('@/components/ui/PressableFeedback.stories') as {
          pressableFeedbackStories: ComponentStory
        }
      ).pressableFeedbackStories
    case 'ds:select':
      return (require('@/components/ui/Select.stories') as { selectStories: ComponentStory })
        .selectStories
    case 'ds:slider':
      return (require('@/components/ui/Slider.stories') as { sliderStories: ComponentStory })
        .sliderStories
    case 'ds:tag-group':
      return (require('@/components/ui/TagGroup.stories') as { tagGroupStories: ComponentStory })
        .tagGroupStories
    case 'ds:progress-bar':
      return (
        require('@/components/shared/ProgressBar.stories') as {
          progressBarStories: ComponentStory
        }
      ).progressBarStories
    case 'ds:badge-overlay':
      return (
        require('@/components/shared/BadgeOverlay.stories') as {
          badgeOverlayStories: ComponentStory
        }
      ).badgeOverlayStories
    case 'ds:empty-state':
      return (
        require('@/components/shared/EmptyState.stories') as {
          emptyStateStories: ComponentStory
        }
      ).emptyStateStories
    case 'ds:screen-loader':
      return (
        require('@/components/shared/ScreenLoader.stories') as {
          screenLoaderStories: ComponentStory
        }
      ).screenLoaderStories
    case 'ds:screen-error':
      return (
        require('@/components/shared/ScreenError.stories') as {
          screenErrorStories: ComponentStory
        }
      ).screenErrorStories
    case 'ds:oauth-button':
      return (
        require('@/components/auth/OAuthButton.stories') as {
          oAuthButtonStories: ComponentStory
        }
      ).oAuthButtonStories
    case 'ds:nft-card':
      return (require('@/components/nft/NFTCard.stories') as { nftCardStories: ComponentStory })
        .nftCardStories
    case 'ds:nft-properties':
      return (
        require('@/components/nft/NFTProperties.stories') as {
          nftPropertiesStories: ComponentStory
        }
      ).nftPropertiesStories
    case 'ds:nft-detail-card':
      return (
        require('@/components/nft/NFTDetailCard.stories') as {
          nftDetailCardStories: ComponentStory
        }
      ).nftDetailCardStories
    case 'ds:mystery-box-card':
      return (
        require('@/components/nft/MysteryBoxCard.stories') as {
          mysteryBoxCardStories: ComponentStory
        }
      ).mysteryBoxCardStories
    case 'ds:breed-outcome-panel':
      return (
        require('@/components/breed/BreedOutcomePanel.stories') as {
          breedOutcomePanelStories: ComponentStory
        }
      ).breedOutcomePanelStories
    case 'ds:breed-parent-slot':
      return (
        require('@/components/breed/BreedParentSlot.stories') as {
          breedParentSlotStories: ComponentStory
        }
      ).breedParentSlotStories
    case 'ds:breed-picker-item-card':
      return (
        require('@/components/breed/BreedPickerItemCard.stories') as {
          breedPickerItemCardStories: ComponentStory
        }
      ).breedPickerItemCardStories
    case 'ds:degen-bar':
      return (
        require('@/components/shared/DegenBar.stories') as { degenBarStories: ComponentStory }
      ).degenBarStories
    case 'ds:tokens-colors':
      return (require('@/components/dev/tokens/TokenStories') as { colorStories: ComponentStory })
        .colorStories
    case 'ds:tokens-typography':
      return (
        require('@/components/dev/tokens/TokenStories') as { typographyStories: ComponentStory }
      ).typographyStories
    case 'ds:tokens-measurements':
      return (
        require('@/components/dev/tokens/TokenStories') as { measurementStories: ComponentStory }
      ).measurementStories
    default:
      return null
  }
}

function PreviewShell({ children, onBack }: { children: ReactNode; onBack: () => void }) {
  return (
    <View className="flex-1">
      {children}
      <View className="absolute bottom-32 left-6 right-6">
        <Button
          variant="primary"
          onPress={onBack}
          className="w-full"
          accessibilityLabel="Back to catalog"
          accessibilityHint="Returns to the design system catalog"
        >
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
          <View key={group.title} className="gap-4">
            <Text className="text-xs font-black text-muted uppercase tracking-wider px-1">
              {group.title}
            </Text>
            {group.layout === 'stack' ? (
              <View className="gap-4">
                {group.items.map((item) => (
                  <View key={item.label}>
                    {item.render()}
                    <Text className="text-xs text-muted text-center mt-2">{item.label}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View className="flex-row flex-wrap gap-x-3 gap-y-4">
                {group.items.map((item) => (
                  <View key={item.label}>
                    {item.render()}
                    <Text className="text-xs text-muted text-center mt-2">{item.label}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Bottom spacing helps last items clear the back button */}
        <View className="h-32" />
      </ScrollView>
    </PreviewShell>
  )
}
