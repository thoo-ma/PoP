import type { ComponentStory } from '@/components/dev/storyTypes'
import { ColorSwatch } from './ColorSwatch'
import { BorderBox, RadiusBox, SpacingBar } from './MeasurementSample'
import { TextSample } from './TextSample'

export const colorStories: ComponentStory = {
  componentName: 'Colors',
  description: 'All theme color tokens. Swatches show the current theme value (light or dark).',
  groups: [
    {
      title: 'Background & Foreground',
      items: [
        { label: 'Background', render: () => <ColorSwatch name="--background" indicator="app" /> },
        { label: 'Foreground', render: () => <ColorSwatch name="--foreground" indicator="app" /> },
        { label: 'Surface', render: () => <ColorSwatch name="--surface" indicator="app" /> },
        {
          label: 'Surface fg',
          render: () => <ColorSwatch name="--surface-foreground" indicator="heroui" />,
        },
        {
          label: 'Surface 2',
          render: () => <ColorSwatch name="--surface-secondary" indicator="app" />,
        },
        {
          label: 'Surface 2 fg',
          render: () => <ColorSwatch name="--surface-secondary-foreground" indicator="heroui" />,
        },
        {
          label: 'Surface 3',
          render: () => <ColorSwatch name="--surface-tertiary" indicator="app" />,
        },
        {
          label: 'Surface 3 fg',
          render: () => <ColorSwatch name="--surface-tertiary-foreground" indicator="heroui" />,
        },
        { label: 'Overlay', render: () => <ColorSwatch name="--overlay" indicator="heroui" /> },
        {
          label: 'Overlay fg',
          render: () => <ColorSwatch name="--overlay-foreground" indicator="heroui" />,
        },
        { label: 'Backdrop', render: () => <ColorSwatch name="--backdrop" indicator="heroui" /> },
      ],
    },
    {
      title: 'Background & Foreground',
      items: [
        { label: 'Background', render: () => <ColorSwatch name="--background" indicator="app" /> },
        { label: 'Foreground', render: () => <ColorSwatch name="--foreground" indicator="app" /> },
        { label: 'Surface', render: () => <ColorSwatch name="--surface" indicator="app" /> },
        {
          label: 'Surface fg',
          render: () => <ColorSwatch name="--surface-foreground" indicator="heroui" />,
        },
        {
          label: 'Surface 2',
          render: () => <ColorSwatch name="--surface-secondary" indicator="app" />,
        },
        {
          label: 'Surface 2 fg',
          render: () => <ColorSwatch name="--surface-secondary-foreground" indicator="heroui" />,
        },
        {
          label: 'Surface 3',
          render: () => <ColorSwatch name="--surface-tertiary" indicator="app" />,
        },
        {
          label: 'Surface 3 fg',
          render: () => <ColorSwatch name="--surface-tertiary-foreground" indicator="heroui" />,
        },
        { label: 'Overlay', render: () => <ColorSwatch name="--overlay" indicator="heroui" /> },
        {
          label: 'Overlay fg',
          render: () => <ColorSwatch name="--overlay-foreground" indicator="heroui" />,
        },
        { label: 'Backdrop', render: () => <ColorSwatch name="--backdrop" indicator="heroui" /> },
      ],
    },
    {
      title: 'Brand & Interactive',
      items: [
        { label: 'Accent', render: () => <ColorSwatch name="--accent" indicator="app" /> },
        {
          label: 'Accent fg',
          render: () => <ColorSwatch name="--accent-foreground" indicator="app" />,
        },
        { label: 'Default', render: () => <ColorSwatch name="--default" indicator="app" /> },
        {
          label: 'Default fg',
          render: () => <ColorSwatch name="--default-foreground" indicator="heroui" />,
        },
        { label: 'Muted', render: () => <ColorSwatch name="--muted" indicator="app" /> },
        { label: 'Border', render: () => <ColorSwatch name="--border" indicator="app" /> },
        { label: 'Separator', render: () => <ColorSwatch name="--separator" indicator="heroui" /> },
        { label: 'Focus', render: () => <ColorSwatch name="--focus" indicator="heroui" /> },
        { label: 'Link', render: () => <ColorSwatch name="--link" indicator="heroui" /> },
      ],
    },
    {
      title: 'Status',
      items: [
        { label: 'Success', render: () => <ColorSwatch name="--success" indicator="app" /> },
        {
          label: 'Success fg',
          render: () => <ColorSwatch name="--success-foreground" indicator="heroui" />,
        },
        { label: 'Warning', render: () => <ColorSwatch name="--warning" indicator="app" /> },
        {
          label: 'Warning fg',
          render: () => <ColorSwatch name="--warning-foreground" indicator="heroui" />,
        },
        { label: 'Danger', render: () => <ColorSwatch name="--danger" indicator="app" /> },
        {
          label: 'Danger fg',
          render: () => <ColorSwatch name="--danger-foreground" indicator="heroui" />,
        },
        { label: 'Info', render: () => <ColorSwatch name="--info" indicator="heroui" /> },
        {
          label: 'Info fg',
          render: () => <ColorSwatch name="--info-foreground" indicator="heroui" />,
        },
      ],
    },
    {
      title: 'NFT Stats',
      items: [
        {
          label: 'Efficiency',
          render: () => <ColorSwatch name="--color-stat-efficiency" indicator="app" />,
        },
        {
          label: 'Resilience',
          render: () => <ColorSwatch name="--color-stat-resilience" indicator="app" />,
        },
        {
          label: 'Comfort',
          render: () => <ColorSwatch name="--color-stat-comfort" indicator="app" />,
        },
        { label: 'Luck', render: () => <ColorSwatch name="--color-stat-luck" indicator="app" /> },
        {
          label: 'Energy',
          render: () => <ColorSwatch name="--color-stat-energy" indicator="app" />,
        },
        { label: 'Level', render: () => <ColorSwatch name="--color-stat-level" indicator="app" /> },
      ],
    },
    {
      title: 'NFT Types',
      items: [
        {
          label: 'Cruise Seat',
          render: () => <ColorSwatch name="--color-type-cruise-seat" indicator="app" />,
        },
        {
          label: 'Turbo Flush',
          render: () => <ColorSwatch name="--color-type-turbo-flush" indicator="app" />,
        },
        {
          label: 'Zen Fortress',
          render: () => <ColorSwatch name="--color-type-zen-fortress" indicator="app" />,
        },
      ],
    },
    {
      title: 'NFT Rarity',
      items: [
        {
          label: 'Common',
          render: () => <ColorSwatch name="--color-rarity-common" indicator="app" />,
        },
        { label: 'Rare', render: () => <ColorSwatch name="--color-rarity-rare" indicator="app" /> },
        {
          label: 'Legendary',
          render: () => <ColorSwatch name="--color-rarity-legendary" indicator="app" />,
        },
        {
          label: 'Transcendent',
          render: () => <ColorSwatch name="--color-rarity-transcendent" indicator="app" />,
        },
      ],
    },
    {
      title: 'Fields & Custom',
      items: [
        {
          label: 'Field bg',
          render: () => <ColorSwatch name="--field-background" indicator="heroui" />,
        },
        {
          label: 'Field fg',
          render: () => <ColorSwatch name="--field-foreground" indicator="heroui" />,
        },
        {
          label: 'Field placeholder',
          render: () => <ColorSwatch name="--field-placeholder" indicator="heroui" />,
        },
        {
          label: 'Field border',
          render: () => <ColorSwatch name="--field-border" indicator="heroui" />,
        },
        { label: 'Amber', render: () => <ColorSwatch name="--amber" indicator="app" /> },
        {
          label: 'Amber fg',
          render: () => <ColorSwatch name="--amber-foreground" indicator="unused" />,
        },
        { label: 'Mystery', render: () => <ColorSwatch name="--mystery" indicator="unused" /> },
        {
          label: 'Mystery fg',
          render: () => <ColorSwatch name="--mystery-foreground" indicator="unused" />,
        },
        { label: 'Segment', render: () => <ColorSwatch name="--segment" indicator="heroui" /> },
        {
          label: 'Segment fg',
          render: () => <ColorSwatch name="--segment-foreground" indicator="heroui" />,
        },
      ],
    },
    {
      title: 'Status',
      items: [
        { label: 'Success', render: () => <ColorSwatch name="--success" indicator="app" /> },
        {
          label: 'Success fg',
          render: () => <ColorSwatch name="--success-foreground" indicator="heroui" />,
        },
        { label: 'Warning', render: () => <ColorSwatch name="--warning" indicator="app" /> },
        {
          label: 'Warning fg',
          render: () => <ColorSwatch name="--warning-foreground" indicator="heroui" />,
        },
        { label: 'Danger', render: () => <ColorSwatch name="--danger" indicator="app" /> },
        {
          label: 'Danger fg',
          render: () => <ColorSwatch name="--danger-foreground" indicator="heroui" />,
        },
        { label: 'Info', render: () => <ColorSwatch name="--info" indicator="heroui" /> },
        {
          label: 'Info fg',
          render: () => <ColorSwatch name="--info-foreground" indicator="heroui" />,
        },
      ],
    },
    {
      title: 'NFT Stats',
      items: [
        {
          label: 'Efficiency',
          render: () => <ColorSwatch name="--color-stat-efficiency" indicator="app" />,
        },
        {
          label: 'Resilience',
          render: () => <ColorSwatch name="--color-stat-resilience" indicator="app" />,
        },
        {
          label: 'Comfort',
          render: () => <ColorSwatch name="--color-stat-comfort" indicator="app" />,
        },
        { label: 'Luck', render: () => <ColorSwatch name="--color-stat-luck" indicator="app" /> },
        {
          label: 'Energy',
          render: () => <ColorSwatch name="--color-stat-energy" indicator="app" />,
        },
        { label: 'Level', render: () => <ColorSwatch name="--color-stat-level" indicator="app" /> },
      ],
    },
    {
      title: 'NFT Types',
      items: [
        {
          label: 'Cruise Seat',
          render: () => <ColorSwatch name="--color-type-cruise-seat" indicator="app" />,
        },
        {
          label: 'Turbo Flush',
          render: () => <ColorSwatch name="--color-type-turbo-flush" indicator="app" />,
        },
        {
          label: 'Zen Fortress',
          render: () => <ColorSwatch name="--color-type-zen-fortress" indicator="app" />,
        },
      ],
    },
    {
      title: 'NFT Rarity',
      items: [
        {
          label: 'Common',
          render: () => <ColorSwatch name="--color-rarity-common" indicator="app" />,
        },
        { label: 'Rare', render: () => <ColorSwatch name="--color-rarity-rare" indicator="app" /> },
        {
          label: 'Legendary',
          render: () => <ColorSwatch name="--color-rarity-legendary" indicator="app" />,
        },
        {
          label: 'Transcendent',
          render: () => <ColorSwatch name="--color-rarity-transcendent" indicator="app" />,
        },
      ],
    },
    {
      title: 'Fields & Custom',
      items: [
        {
          label: 'Field bg',
          render: () => <ColorSwatch name="--field-background" indicator="heroui" />,
        },
        {
          label: 'Field fg',
          render: () => <ColorSwatch name="--field-foreground" indicator="heroui" />,
        },
        {
          label: 'Field placeholder',
          render: () => <ColorSwatch name="--field-placeholder" indicator="heroui" />,
        },
        {
          label: 'Field border',
          render: () => <ColorSwatch name="--field-border" indicator="heroui" />,
        },
        { label: 'Amber', render: () => <ColorSwatch name="--amber" indicator="app" /> },
        {
          label: 'Amber fg',
          render: () => <ColorSwatch name="--amber-foreground" indicator="unused" />,
        },
        { label: 'Mystery', render: () => <ColorSwatch name="--mystery" indicator="unused" /> },
        {
          label: 'Mystery fg',
          render: () => <ColorSwatch name="--mystery-foreground" indicator="unused" />,
        },
        { label: 'Segment', render: () => <ColorSwatch name="--segment" indicator="heroui" /> },
        {
          label: 'Segment fg',
          render: () => <ColorSwatch name="--segment-foreground" indicator="heroui" />,
        },
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
    {
      title: 'Icons',
      layout: 'grid',
      items: [
        {
          label: 'icon-xl',
          render: () => <TextSample size="text-icon-xl font-black" text="🪠" />,
        },
        {
          label: 'icon-lg',
          render: () => <TextSample size="text-icon-lg font-black" text="🚽" />,
        },
      ],
    },
  ],
}

export const measurementStories: ComponentStory = {
  componentName: 'Measurements',
  description: 'Spacing, border-radius, and border-width tokens used throughout the app.',
  groups: [
    {
      title: 'Spacing',
      items: [
        { label: 'screen-top-sm', render: () => <SpacingBar name="--spacing-screen-top-sm" /> },
        { label: 'screen-top-md', render: () => <SpacingBar name="--spacing-screen-top-md" /> },
        { label: 'tab-clearance', render: () => <SpacingBar name="--spacing-tab-clearance" /> },
        {
          label: 'tab-clearance-hdr',
          render: () => <SpacingBar name="--spacing-tab-clearance-header" />,
        },
        {
          label: 'tab-clearance-xl',
          render: () => <SpacingBar name="--spacing-tab-clearance-xl" />,
        },
        { label: 'control-lg', render: () => <SpacingBar name="--spacing-control-lg" /> },
        { label: 'control-md', render: () => <SpacingBar name="--spacing-control-md" /> },
        { label: 'card-image', render: () => <SpacingBar name="--spacing-card-image" /> },
        { label: 'nft-picker-w', render: () => <SpacingBar name="--spacing-nft-picker-w" /> },
        { label: 'nft-picker-h', render: () => <SpacingBar name="--spacing-nft-picker-h" /> },
        { label: 'thumbnail', render: () => <SpacingBar name="--spacing-thumbnail" /> },
        { label: 'label-lg', render: () => <SpacingBar name="--spacing-label-lg" /> },
        { label: 'label-md', render: () => <SpacingBar name="--spacing-label-md" /> },
        { label: 'label-sm', render: () => <SpacingBar name="--spacing-label-sm" /> },
        { label: 'dialog-max', render: () => <SpacingBar name="--spacing-dialog-max" /> },
        { label: 'counter-min', render: () => <SpacingBar name="--spacing-counter-min" /> },
        { label: 'phase-px', render: () => <SpacingBar name="--spacing-phase-px" /> },
      ],
    },
    {
      title: 'Border Radius',
      items: [
        { label: 'tag', render: () => <RadiusBox name="--radius-tag" /> },
        { label: 'body', render: () => <RadiusBox name="--radius-body" /> },
        { label: 'thumbnail', render: () => <RadiusBox name="--radius-thumbnail" /> },
        { label: 'frame', render: () => <RadiusBox name="--radius-frame" /> },
        { label: 'inset', render: () => <RadiusBox name="--radius-inset" /> },
        { label: 'panel', render: () => <RadiusBox name="--radius-panel" /> },
        { label: 'card', render: () => <RadiusBox name="--radius-card" /> },
        { label: 'modal', render: () => <RadiusBox name="--radius-modal" /> },
      ],
    },
    {
      title: 'Border Width',
      items: [
        { label: 'hairline', render: () => <BorderBox name="--border-hairline" /> },
        { label: 'press', render: () => <BorderBox name="--border-press" /> },
        { label: 'raise', render: () => <BorderBox name="--border-raise" /> },
      ],
    },
  ],
}
