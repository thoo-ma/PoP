import type { ComponentStory } from '@/components/dev/storyTypes'
import ProgressBar from '@/components/shared/ProgressBar'

export const progressBarStories: ComponentStory = {
  componentName: 'ProgressBar',
  description:
    'Custom progress bar with sm/md size, runtime color or Tailwind colorClass, and empty/partial/fill states.',
  groups: [
    {
      title: 'Sizes',
      items: [
        {
          label: 'Small (sm)',
          render: () => (
            <ProgressBar value={65} colorClass="bg-accent" size="sm" className="w-60" />
          ),
        },
        {
          label: 'Medium (md)',
          render: () => (
            <ProgressBar value={65} colorClass="bg-accent" size="md" className="w-60" />
          ),
        },
      ],
    },
    {
      title: 'Fill Levels',
      items: [
        {
          label: 'Empty (0%)',
          render: () => <ProgressBar value={0} colorClass="bg-accent" className="w-60" />,
        },
        {
          label: 'Partial (35%)',
          render: () => <ProgressBar value={35} colorClass="bg-accent" className="w-60" />,
        },
        {
          label: 'Half (50%)',
          render: () => <ProgressBar value={50} colorClass="bg-accent" className="w-60" />,
        },
        {
          label: 'Almost full (82%)',
          render: () => <ProgressBar value={82} colorClass="bg-accent" className="w-60" />,
        },
        {
          label: 'Full (100%)',
          render: () => <ProgressBar value={100} colorClass="bg-accent" className="w-60" />,
        },
      ],
    },
    {
      title: 'color vs colorClass',
      items: [
        {
          label: 'colorClass (Tailwind)',
          render: () => <ProgressBar value={72} colorClass="bg-stat-efficiency" className="w-60" />,
        },
        {
          label: 'color (runtime hex)',
          render: () => <ProgressBar value={72} color="#10B981" className="w-60" />,
        },
      ],
    },
  ],
}
