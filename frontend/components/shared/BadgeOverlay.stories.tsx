import { View } from 'react-native'
import type { ComponentStory } from '@/components/dev/storyTypes'
import BadgeOverlay from '@/components/shared/BadgeOverlay'

export const badgeOverlayStories: ComponentStory = {
  componentName: 'BadgeOverlay',
  description: 'Corner-positioned badge overlay. 5 positions, label sizes, Chip color integration.',
  groups: [
    {
      title: 'Positions',
      items: [
        {
          label: 'Top Left',
          render: () => (
            <View className="w-36 h-24 bg-surface-secondary rounded-frame border border-border relative">
              <BadgeOverlay position="topLeft" chipColor="accent">
                ×3
              </BadgeOverlay>
            </View>
          ),
        },
        {
          label: 'Top Right',
          render: () => (
            <View className="w-36 h-24 bg-surface-secondary rounded-frame border border-border relative">
              <BadgeOverlay position="topRight" chipColor="accent">
                RARE
              </BadgeOverlay>
            </View>
          ),
        },
        {
          label: 'Bottom Left',
          render: () => (
            <View className="w-36 h-24 bg-surface-secondary rounded-frame border border-border relative">
              <BadgeOverlay position="bottomLeft" chipColor="success">
                LIVE
              </BadgeOverlay>
            </View>
          ),
        },
        {
          label: 'Bottom Right',
          render: () => (
            <View className="w-36 h-24 bg-surface-secondary rounded-frame border border-border relative">
              <BadgeOverlay position="bottomRight" chipColor="warning">
                SALE
              </BadgeOverlay>
            </View>
          ),
        },
        {
          label: 'Top Right Offset',
          render: () => (
            <View className="w-36 h-24 bg-surface-secondary rounded-frame border border-border relative">
              <BadgeOverlay position="topRightOffset" chipColor="danger">
                NEW
              </BadgeOverlay>
            </View>
          ),
        },
      ],
    },
    {
      title: 'Label Sizes',
      items: [
        {
          label: 'Tiny',
          render: () => (
            <View className="w-36 h-24 bg-surface-secondary rounded-frame border border-border relative">
              <BadgeOverlay position="topRight" labelSize="tiny" chipColor="accent">
                tiny
              </BadgeOverlay>
            </View>
          ),
        },
        {
          label: 'XS',
          render: () => (
            <View className="w-36 h-24 bg-surface-secondary rounded-frame border border-border relative">
              <BadgeOverlay position="topRight" labelSize="xs" chipColor="accent">
                XS
              </BadgeOverlay>
            </View>
          ),
        },
        {
          label: 'SM',
          render: () => (
            <View className="w-36 h-24 bg-surface-secondary rounded-frame border border-border relative">
              <BadgeOverlay position="topRight" labelSize="sm" chipColor="accent">
                SM
              </BadgeOverlay>
            </View>
          ),
        },
        {
          label: 'Base',
          render: () => (
            <View className="w-36 h-24 bg-surface-secondary rounded-frame border border-border relative">
              <BadgeOverlay position="topRight" labelSize="base" chipColor="accent">
                Base
              </BadgeOverlay>
            </View>
          ),
        },
      ],
    },
  ],
}
