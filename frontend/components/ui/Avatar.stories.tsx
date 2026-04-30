import type { ComponentStory } from '@/components/dev/storyTypes'
import { Avatar } from '@/components/ui'

export const avatarStories: ComponentStory = {
  componentName: 'Avatar',
  description: 'Brand-baked Avatar with image and fallback support. 3 sizes, 5 color variants.',
  groups: [
    {
      title: 'Sizes',
      items: [
        {
          label: 'Small',
          render: () => (
            <Avatar size="sm" alt="AB" animation="disable-all">
              <Avatar.Fallback>AB</Avatar.Fallback>
            </Avatar>
          ),
        },
        {
          label: 'Medium',
          render: () => (
            <Avatar size="md" alt="CD" animation="disable-all">
              <Avatar.Fallback>CD</Avatar.Fallback>
            </Avatar>
          ),
        },
        {
          label: 'Large',
          render: () => (
            <Avatar size="lg" alt="EF" animation="disable-all">
              <Avatar.Fallback>EF</Avatar.Fallback>
            </Avatar>
          ),
        },
      ],
    },
    {
      title: 'With Image vs Fallback',
      items: [
        {
          label: 'Fallback initials',
          render: () => (
            <Avatar size="lg" alt="JD" animation="disable-all">
              <Avatar.Fallback>JD</Avatar.Fallback>
            </Avatar>
          ),
        },
        {
          label: 'Fallback icon (empty)',
          render: () => (
            <Avatar size="lg" alt="user" animation="disable-all">
              <Avatar.Fallback />
            </Avatar>
          ),
        },
        {
          label: 'Image source',
          render: () => (
            <Avatar size="lg" alt="avatar" animation="disable-all">
              <Avatar.Image source={{ uri: 'https://i.pravatar.cc/150?u=avatar' }} />
              <Avatar.Fallback>NA</Avatar.Fallback>
            </Avatar>
          ),
        },
      ],
    },
    {
      title: 'Color Variants',
      items: [
        {
          label: 'Default',
          render: () => (
            <Avatar size="md" color="default" alt="DF" animation="disable-all">
              <Avatar.Fallback>DF</Avatar.Fallback>
            </Avatar>
          ),
        },
        {
          label: 'Accent',
          render: () => (
            <Avatar size="md" color="accent" alt="AC" animation="disable-all">
              <Avatar.Fallback>AC</Avatar.Fallback>
            </Avatar>
          ),
        },
        {
          label: 'Success',
          render: () => (
            <Avatar size="md" color="success" alt="SC" animation="disable-all">
              <Avatar.Fallback>SC</Avatar.Fallback>
            </Avatar>
          ),
        },
        {
          label: 'Warning',
          render: () => (
            <Avatar size="md" color="warning" alt="WR" animation="disable-all">
              <Avatar.Fallback>WR</Avatar.Fallback>
            </Avatar>
          ),
        },
        {
          label: 'Danger',
          render: () => (
            <Avatar size="md" color="danger" alt="DG" animation="disable-all">
              <Avatar.Fallback>DG</Avatar.Fallback>
            </Avatar>
          ),
        },
      ],
    },
  ],
}
