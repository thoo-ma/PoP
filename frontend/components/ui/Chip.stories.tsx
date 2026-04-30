import { MaterialIcons } from '@expo/vector-icons'
import type { ComponentStory } from '@/components/dev/storyTypes'
import { Chip } from '@/components/ui'

export const chipStories: ComponentStory = {
  componentName: 'Chip',
  description: 'Brand-baked Chip with capsule shape. 4 variants, 3 sizes, 5 colors, with icons.',
  groups: [
    {
      title: 'Variants',
      items: [
        {
          label: 'Primary',
          render: () => (
            <Chip variant="primary" size="md" animation="disable-all">
              <Chip.Label>Primary</Chip.Label>
            </Chip>
          ),
        },
        {
          label: 'Secondary',
          render: () => (
            <Chip variant="secondary" size="md" animation="disable-all">
              <Chip.Label>Secondary</Chip.Label>
            </Chip>
          ),
        },
        {
          label: 'Tertiary',
          render: () => (
            <Chip variant="tertiary" size="md" animation="disable-all">
              <Chip.Label>Tertiary</Chip.Label>
            </Chip>
          ),
        },
        {
          label: 'Soft',
          render: () => (
            <Chip variant="soft" size="md" animation="disable-all">
              <Chip.Label>Soft</Chip.Label>
            </Chip>
          ),
        },
      ],
    },
    {
      title: 'Sizes',
      items: [
        {
          label: 'Small',
          render: () => (
            <Chip variant="primary" size="sm" animation="disable-all">
              <Chip.Label>Small</Chip.Label>
            </Chip>
          ),
        },
        {
          label: 'Medium',
          render: () => (
            <Chip variant="primary" size="md" animation="disable-all">
              <Chip.Label>Medium</Chip.Label>
            </Chip>
          ),
        },
        {
          label: 'Large',
          render: () => (
            <Chip variant="primary" size="lg" animation="disable-all">
              <Chip.Label>Large</Chip.Label>
            </Chip>
          ),
        },
      ],
    },
    {
      title: 'Colors',
      items: [
        {
          label: 'Accent',
          render: () => (
            <Chip variant="primary" color="accent" size="md" animation="disable-all">
              <Chip.Label>Accent</Chip.Label>
            </Chip>
          ),
        },
        {
          label: 'Default',
          render: () => (
            <Chip variant="primary" color="default" size="md" animation="disable-all">
              <Chip.Label>Default</Chip.Label>
            </Chip>
          ),
        },
        {
          label: 'Success',
          render: () => (
            <Chip variant="primary" color="success" size="md" animation="disable-all">
              <Chip.Label>Success</Chip.Label>
            </Chip>
          ),
        },
        {
          label: 'Warning',
          render: () => (
            <Chip variant="primary" color="warning" size="md" animation="disable-all">
              <Chip.Label>Warning</Chip.Label>
            </Chip>
          ),
        },
        {
          label: 'Danger',
          render: () => (
            <Chip variant="primary" color="danger" size="md" animation="disable-all">
              <Chip.Label>Danger</Chip.Label>
            </Chip>
          ),
        },
      ],
    },
    {
      title: 'With Icon',
      items: [
        {
          label: 'Leading icon',
          render: () => (
            <Chip variant="primary" color="accent" size="md" animation="disable-all">
              <MaterialIcons name="star" size={12} color="white" />
              <Chip.Label>Featured</Chip.Label>
            </Chip>
          ),
        },
        {
          label: 'Trailing icon',
          render: () => (
            <Chip variant="secondary" size="md" animation="disable-all">
              <Chip.Label>Remove</Chip.Label>
              <MaterialIcons name="close" size={14} color="white" />
            </Chip>
          ),
        },
        {
          label: 'Status dot',
          render: () => (
            <Chip variant="secondary" color="success" size="md" animation="disable-all">
              <Chip.Label>Online</Chip.Label>
            </Chip>
          ),
        },
      ],
    },
  ],
}
