import type { ComponentStory } from '@/components/dev/storyTypes'
import { Slider } from '@/components/ui'

export const sliderStories: ComponentStory = {
  componentName: 'Slider',
  description: 'Brand-baked Slider with track, fill, and thumb. Supports disabled state.',
  groups: [
    {
      title: 'States',
      items: [
        {
          label: 'Default (50%)',
          render: () => <Slider defaultValue={50} className="w-60" />,
        },
        {
          label: 'Empty (0%)',
          render: () => <Slider defaultValue={0} className="w-60" />,
        },
        {
          label: 'Full (100%)',
          render: () => <Slider defaultValue={100} className="w-60" />,
        },
        {
          label: 'Disabled',
          render: () => <Slider defaultValue={50} isDisabled className="w-60" />,
        },
      ],
    },
  ],
}
