import type { ComponentStory } from '@/components/dev/storyTypes'
import { ColorSwatch } from './ColorSwatch'
import { TextSample } from './TextSample'

export const colorStories: ComponentStory = {
  componentName: 'Colors',
  description: 'All theme color tokens. Swatches show the current theme value (light or dark).',
  groups: [
    {
      title: 'Background & Foreground',
      items: [
        { label: 'Background', render: () => <ColorSwatch name="--background" /> },
        { label: 'Foreground', render: () => <ColorSwatch name="--foreground" /> },
        { label: 'Surface', render: () => <ColorSwatch name="--surface" /> },
        { label: 'Surface fg', render: () => <ColorSwatch name="--surface-foreground" /> },
        { label: 'Surface 2', render: () => <ColorSwatch name="--surface-secondary" /> },
        {
          label: 'Surface 2 fg',
          render: () => <ColorSwatch name="--surface-secondary-foreground" />,
        },
        { label: 'Surface 3', render: () => <ColorSwatch name="--surface-tertiary" /> },
        {
          label: 'Surface 3 fg',
          render: () => <ColorSwatch name="--surface-tertiary-foreground" />,
        },
        { label: 'Overlay', render: () => <ColorSwatch name="--overlay" /> },
        { label: 'Overlay fg', render: () => <ColorSwatch name="--overlay-foreground" /> },
        { label: 'Backdrop', render: () => <ColorSwatch name="--backdrop" /> },
      ],
    },
    {
      title: 'Brand & Interactive',
      items: [
        { label: 'Accent', render: () => <ColorSwatch name="--accent" /> },
        { label: 'Accent fg', render: () => <ColorSwatch name="--accent-foreground" /> },
        { label: 'Default', render: () => <ColorSwatch name="--default" /> },
        { label: 'Default fg', render: () => <ColorSwatch name="--default-foreground" /> },
        { label: 'Muted', render: () => <ColorSwatch name="--muted" /> },
        { label: 'Border', render: () => <ColorSwatch name="--border" /> },
        { label: 'Separator', render: () => <ColorSwatch name="--separator" /> },
        { label: 'Focus', render: () => <ColorSwatch name="--focus" /> },
        { label: 'Link', render: () => <ColorSwatch name="--link" /> },
      ],
    },
    {
      title: 'Status',
      items: [
        { label: 'Success', render: () => <ColorSwatch name="--success" /> },
        { label: 'Success fg', render: () => <ColorSwatch name="--success-foreground" /> },
        { label: 'Warning', render: () => <ColorSwatch name="--warning" /> },
        { label: 'Warning fg', render: () => <ColorSwatch name="--warning-foreground" /> },
        { label: 'Danger', render: () => <ColorSwatch name="--danger" /> },
        { label: 'Danger fg', render: () => <ColorSwatch name="--danger-foreground" /> },
        { label: 'Info', render: () => <ColorSwatch name="--info" /> },
        { label: 'Info fg', render: () => <ColorSwatch name="--info-foreground" /> },
      ],
    },
    {
      title: 'NFT Stats',
      items: [
        { label: 'Efficiency', render: () => <ColorSwatch name="--color-stat-efficiency" /> },
        { label: 'Resilience', render: () => <ColorSwatch name="--color-stat-resilience" /> },
        { label: 'Comfort', render: () => <ColorSwatch name="--color-stat-comfort" /> },
        { label: 'Luck', render: () => <ColorSwatch name="--color-stat-luck" /> },
        { label: 'Energy', render: () => <ColorSwatch name="--color-stat-energy" /> },
        { label: 'Level', render: () => <ColorSwatch name="--color-stat-level" /> },
      ],
    },
    {
      title: 'NFT Types',
      items: [
        { label: 'Cruise Seat', render: () => <ColorSwatch name="--color-type-cruise-seat" /> },
        { label: 'Turbo Flush', render: () => <ColorSwatch name="--color-type-turbo-flush" /> },
        { label: 'Zen Fortress', render: () => <ColorSwatch name="--color-type-zen-fortress" /> },
      ],
    },
    {
      title: 'NFT Rarity',
      items: [
        { label: 'Common', render: () => <ColorSwatch name="--color-rarity-common" /> },
        { label: 'Rare', render: () => <ColorSwatch name="--color-rarity-rare" /> },
        { label: 'Legendary', render: () => <ColorSwatch name="--color-rarity-legendary" /> },
        { label: 'Transcendent', render: () => <ColorSwatch name="--color-rarity-transcendent" /> },
      ],
    },
    {
      title: 'Fields & Custom',
      items: [
        { label: 'Field bg', render: () => <ColorSwatch name="--field-background" /> },
        { label: 'Field fg', render: () => <ColorSwatch name="--field-foreground" /> },
        { label: 'Field placeholder', render: () => <ColorSwatch name="--field-placeholder" /> },
        { label: 'Field border', render: () => <ColorSwatch name="--field-border" /> },
        { label: 'Amber', render: () => <ColorSwatch name="--amber" /> },
        { label: 'Amber fg', render: () => <ColorSwatch name="--amber-foreground" /> },
        { label: 'Mystery', render: () => <ColorSwatch name="--mystery" /> },
        { label: 'Mystery fg', render: () => <ColorSwatch name="--mystery-foreground" /> },
        { label: 'Segment', render: () => <ColorSwatch name="--segment" /> },
        { label: 'Segment fg', render: () => <ColorSwatch name="--segment-foreground" /> },
      ],
    },
  ],
}

export const typographyStories: ComponentStory = {
  componentName: 'Typography',
  description: 'Full type scale. Each sample shows the Tailwind class and size in pixels.',
  groups: [
    {
      title: 'Display',
      layout: 'grid',
      items: [
        {
          label: 'display-xl',
          render: () => (
            <TextSample size="text-display-xl font-black" text="The quick brown fox jumps" />
          ),
        },
        {
          label: 'display-lg',
          render: () => (
            <TextSample size="text-display-lg font-black" text="The quick brown fox jumps" />
          ),
        },
      ],
    },
    {
      title: 'Headings',
      layout: 'grid',
      items: [
        {
          label: 'heading-lg',
          render: () => (
            <TextSample size="text-heading-lg font-black" text="Heading Large — 32px" />
          ),
        },
        {
          label: 'heading-md',
          render: () => (
            <TextSample size="text-heading-md font-black" text="Heading Medium — 26px" />
          ),
        },
        {
          label: 'heading-sm',
          render: () => (
            <TextSample size="text-heading-sm font-black" text="Heading Small — 22px" />
          ),
        },
        {
          label: 'heading-xs',
          render: () => <TextSample size="text-heading-xs font-black" text="Heading XS — 20px" />,
        },
      ],
    },
    {
      title: 'Body',
      layout: 'grid',
      items: [
        {
          label: 'body-xl',
          render: () => (
            <TextSample size="text-body-xl font-bold" text="Body XL — 17px — The quick brown fox" />
          ),
        },
        {
          label: 'body-base',
          render: () => (
            <TextSample size="text-body-base" text="Body base — 16px — The quick brown fox" />
          ),
        },
        {
          label: 'body-lg',
          render: () => (
            <TextSample size="text-body-lg font-bold" text="Body LG — 15px — The quick brown fox" />
          ),
        },
        {
          label: 'body-md',
          render: () => (
            <TextSample size="text-body-md font-bold" text="Body MD — 14px — The quick brown fox" />
          ),
        },
        {
          label: 'body-sm',
          render: () => (
            <TextSample size="text-body-sm font-bold" text="Body SM — 13px — The quick brown fox" />
          ),
        },
      ],
    },
    {
      title: 'Caption & Icon',
      layout: 'grid',
      items: [
        {
          label: 'caption',
          render: () => (
            <TextSample size="text-caption font-bold" text="Caption — 11px — The quick brown fox" />
          ),
        },
        {
          label: 'caption-sm',
          render: () => (
            <TextSample size="text-caption-sm" text="Caption SM — 10px — The quick brown fox" />
          ),
        },
      ],
    },
    {
      title: 'Weight comparisons (body-base)',
      layout: 'grid',
      items: [
        {
          label: 'Regular',
          render: () => (
            <TextSample size="text-body-base" text="The quick brown fox jumps over the lazy dog" />
          ),
        },
        {
          label: 'Bold',
          render: () => (
            <TextSample
              size="text-body-base font-bold"
              text="The quick brown fox jumps over the lazy dog"
            />
          ),
        },
        {
          label: 'Black',
          render: () => (
            <TextSample
              size="text-body-base font-black"
              text="The quick brown fox jumps over the lazy dog"
            />
          ),
        },
        {
          label: 'Black + uppercase',
          render: () => (
            <TextSample
              size="text-body-base font-black uppercase tracking-wider"
              text="The quick brown fox jumps"
            />
          ),
        },
      ],
    },
  ],
}
