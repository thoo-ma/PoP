import { MaterialIcons } from '@expo/vector-icons'
import type { ComponentStory } from '@/components/dev/storyTypes'
import { Button } from '@/components/ui'

export const buttonStories: ComponentStory = {
  componentName: 'Button',
  description: 'Brand-baked button with tactile raise effect. 7 variants, 3 sizes.',
  groups: [
    {
      title: 'Variants',
      items: [
        {
          label: 'Primary',
          render: () => (
            <Button variant="primary">
              <Button.Label>Primary</Button.Label>
            </Button>
          ),
        },
        {
          label: 'Secondary',
          render: () => (
            <Button variant="secondary">
              <Button.Label>Secondary</Button.Label>
            </Button>
          ),
        },
        {
          label: 'Tertiary',
          render: () => (
            <Button variant="tertiary">
              <Button.Label>Tertiary</Button.Label>
            </Button>
          ),
        },
        {
          label: 'Outline',
          render: () => (
            <Button variant="outline">
              <Button.Label>Outline</Button.Label>
            </Button>
          ),
        },
        {
          label: 'Ghost',
          render: () => (
            <Button variant="ghost">
              <Button.Label>Ghost</Button.Label>
            </Button>
          ),
        },
        {
          label: 'Danger',
          render: () => (
            <Button variant="danger">
              <Button.Label>Danger</Button.Label>
            </Button>
          ),
        },
        {
          label: 'Danger Soft',
          render: () => (
            <Button variant="danger-soft">
              <Button.Label>Danger Soft</Button.Label>
            </Button>
          ),
        },
      ],
    },
    {
      title: 'Disabled',
      items: [
        {
          label: 'Primary',
          render: () => (
            <Button variant="primary" isDisabled>
              <Button.Label>Primary</Button.Label>
            </Button>
          ),
        },
        {
          label: 'Secondary',
          render: () => (
            <Button variant="secondary" isDisabled>
              <Button.Label>Secondary</Button.Label>
            </Button>
          ),
        },
        {
          label: 'Tertiary',
          render: () => (
            <Button variant="tertiary" isDisabled>
              <Button.Label>Tertiary</Button.Label>
            </Button>
          ),
        },
        {
          label: 'Outline',
          render: () => (
            <Button variant="outline" isDisabled>
              <Button.Label>Outline</Button.Label>
            </Button>
          ),
        },
        {
          label: 'Ghost',
          render: () => (
            <Button variant="ghost" isDisabled>
              <Button.Label>Ghost</Button.Label>
            </Button>
          ),
        },
        {
          label: 'Danger',
          render: () => (
            <Button variant="danger" isDisabled>
              <Button.Label>Danger</Button.Label>
            </Button>
          ),
        },
        {
          label: 'Danger Soft',
          render: () => (
            <Button variant="danger-soft" isDisabled>
              <Button.Label>Danger Soft</Button.Label>
            </Button>
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
            <Button variant="primary" size="sm">
              <Button.Label>Small</Button.Label>
            </Button>
          ),
        },
        {
          label: 'Medium',
          render: () => (
            <Button variant="primary" size="md">
              <Button.Label>Medium</Button.Label>
            </Button>
          ),
        },
        {
          label: 'Large',
          render: () => (
            <Button variant="primary" size="lg">
              <Button.Label>Large</Button.Label>
            </Button>
          ),
        },
      ],
    },
    {
      title: 'With Icon',
      items: [
        {
          label: 'Leading',
          render: () => (
            <Button variant="primary">
              <MaterialIcons name="add" size={18} color="white" />
              <Button.Label>Add Item</Button.Label>
            </Button>
          ),
        },
        {
          label: 'Trailing',
          render: () => (
            <Button variant="primary">
              <Button.Label>Next</Button.Label>
              <MaterialIcons name="arrow-forward" size={18} color="white" />
            </Button>
          ),
        },
        {
          label: 'Icon only',
          render: () => (
            <Button variant="primary" isIconOnly>
              <MaterialIcons name="favorite" size={18} color="white" />
            </Button>
          ),
        },
      ],
    },
  ],
}
