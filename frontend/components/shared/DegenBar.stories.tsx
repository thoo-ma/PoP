import type { ComponentStory } from '@/components/dev/storyTypes'
import DegenBar from '@/components/shared/DegenBar'

export const degenBarStories: ComponentStory = {
  componentName: 'DegenBar',
  description:
    'Risk slider (0–100%) for paid actions. Real-time preview of cost reduction and bust probability.',
  groups: [
    {
      title: 'States',
      layout: 'stack',
      items: [
        {
          label: 'Enabled',
          render: () => <DegenBar baseCost={500} onDegenChange={() => {}} disabled={false} />,
        },
        {
          label: 'Disabled',
          render: () => <DegenBar baseCost={500} onDegenChange={() => {}} disabled />,
        },
      ],
    },
  ],
}
