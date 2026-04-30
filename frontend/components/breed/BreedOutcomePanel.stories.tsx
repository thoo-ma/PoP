import BreedOutcomePanel from '@/components/breed/BreedOutcomePanel'
import type { ComponentStory } from '@/components/dev/storyTypes'

export const breedOutcomePanelStories: ComponentStory = {
  componentName: 'BreedOutcomePanel',
  description:
    'Read-only panel showing rarity outcome probabilities for a given parent pair. Zero-probability rows are hidden.',
  groups: [
    {
      title: 'Parent Pair',
      layout: 'stack',
      items: [
        {
          label: 'Common × Common',
          render: () => <BreedOutcomePanel r1="common" r2="common" />,
        },
        {
          label: 'Common × Rare',
          render: () => <BreedOutcomePanel r1="common" r2="rare" />,
        },
        {
          label: 'Rare × Legendary',
          render: () => <BreedOutcomePanel r1="rare" r2="legendary" />,
        },
        {
          label: 'Legendary × Transcendent',
          render: () => <BreedOutcomePanel r1="legendary" r2="transcendent" />,
        },
      ],
    },
  ],
}
