import type { ComponentStory } from '@/components/dev/storyTypes'
import { Spinner } from '@/components/ui'

export const spinnerStories: ComponentStory = {
  componentName: 'Spinner',
  description: 'Animated loading indicator. 3 sizes, color accent override.',
  groups: [
    {
      title: 'Sizes',
      items: [
        {
          label: 'Small',
          render: () => <Spinner size="sm" />,
        },
        {
          label: 'Medium',
          render: () => <Spinner size="md" />,
        },
        {
          label: 'Large',
          render: () => <Spinner size="lg" />,
        },
      ],
    },
    {
      title: 'Colors',
      items: [
        {
          label: 'Default',
          render: () => <Spinner size="md" color="default" />,
        },
        {
          label: 'Success',
          render: () => <Spinner size="md" color="success" />,
        },
        {
          label: 'Warning',
          render: () => <Spinner size="md" color="warning" />,
        },
        {
          label: 'Danger',
          render: () => <Spinner size="md" color="danger" />,
        },
        {
          label: 'Custom hex',
          render: () => <Spinner size="md" color="#8B5CF6" />,
        },
      ],
    },
  ],
}
