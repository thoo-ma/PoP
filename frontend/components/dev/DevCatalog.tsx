// biome-ignore lint/style/noRestrictedImports: Accordion is not yet wrapped in @/components/ui
import { Accordion, AccordionLayoutTransition } from 'heroui-native'
import { Text } from 'react-native'
import Animated from 'react-native-reanimated'
import { Button } from '@/components/ui'

// ─── Catalog definition ──────────────────────────────────────────────────────

type CatalogEntry = [key: string, label: string]

interface CatalogSection {
  title: string
  entries: CatalogEntry[]
}

const CATALOG: CatalogSection[] = [
  {
    title: 'Profile',
    entries: [
      ['profile:stats-loading', 'Stats loading'],
      ['profile:stats-loaded', 'Stats loaded'],
      ['profile:poop-balance', 'POOP Balance'],
      ['profile:sign-out-dialog', 'Sign-out dialog'],
      ['profile:dev-catalog', 'Dev Catalog (meta)'],
      ['profile:error', 'Error state'],
    ],
  },
  {
    title: 'Auth',
    entries: [
      ['auth:invite-code', 'Invite code \u2014 idle'],
      ['auth:invite-code-loading', 'Invite code \u2014 loading'],
      ['auth:invite-code-error', 'Invite code \u2014 error'],
    ],
  },
  {
    title: 'Shared',
    entries: [
      ['shared:screen-error', 'ScreenError'],
      ['shared:screen-loader', 'ScreenLoader'],
      ['shared:error-boundary', 'ErrorBoundary'],
    ],
  },
  {
    title: 'Breed',
    entries: [
      ['breed:loading', 'Loading guard'],
      ['breed:need-2-nfts', '< 2 NFTs guard'],
      ['breed:idle-no-parents', 'Idle — no parents'],
      ['breed:parents-selected', 'Parents selected'],
      ['breed:at-limit', 'At breed limit'],
      ['breed:insufficient-poop', 'Insufficient POOP'],
      ['breed:bust-inline', 'Bust (inline)'],
      ['breed:result', 'Mystery Box result'],
    ],
  },
  {
    title: 'Repair',
    entries: [
      ['repair:no-nft-placeholder', 'Select NFT placeholder'],
      ['repair:no-nfts', 'No NFTs available'],
      ['repair:nft-selected', 'NFT + slider + DegenBar'],
      ['repair:full-energy', 'Full energy'],
      ['repair:success', 'Repair complete'],
      ['repair:bust-inline', 'Bust (inline)'],
    ],
  },
  {
    title: 'Poop — Game Phases',
    entries: [
      ['poop:no-nfts', 'No NFTs available'],
      ['poop:idle-ready', 'Idle — ready'],
      ['poop:idle-cooldown', 'Idle — on cooldown'],
      ['poop:idle-no-energy', 'Idle — no energy'],
      ['poop:countdown', 'Countdown 3-2-1'],
      ['poop:immobility-ok', 'Immobility — hold still'],
      ['poop:immobility-warning', 'Immobility — movement!'],
      ['poop:prompt', 'Prompt — record flush'],
      ['poop:recording', 'Recording'],
      ['poop:result-not-detected', 'Result — not detected'],
      ['poop:result-success', 'Result — success + loot'],
      ['poop:result-rate-limit', 'Result — rate limit'],
      ['poop:result-error', 'Result — error'],
      ['poop:analyzing', 'Analyzing'],
      ['poop:roulette', 'Roulette'],
    ],
  },
  {
    title: 'Vault',
    entries: [
      ['vault:boxes-loading', 'Boxes skeleton'],
      ['vault:boxes-error', 'Boxes inline error'],
      ['vault:nft-with-points', 'NFT with stat points'],
      ['vault:empty-nfts', 'Empty NFTs tab'],
      ['vault:empty-boxes', 'Empty boxes tab'],
      ['vault:nft-error', 'NFT load error'],
    ],
  },
  {
    title: 'Marketplace',
    entries: [
      ['marketplace:loading', 'Skeleton loading'],
      ['marketplace:empty-sell', 'Empty sell tab'],
      ['marketplace:buy-card', 'Buy card with price'],
      ['marketplace:coming-soon-dialog', 'Coming soon dialog'],
      ['marketplace:sell-card', 'Sell card with Unlist'],
      ['marketplace:empty-buy', 'Empty buy tab'],
      ['marketplace:error', 'Error state'],
    ],
  },
  {
    title: 'Components',
    entries: [
      ['component:nft-card', 'NFTCard — 4 rarities'],
      ['component:mystery-box-card', 'MysteryBoxCard — 4 rarities'],
      ['component:degen-bar', 'DegenBar (interactive)'],
      ['component:loot-roulette', 'Loot Roulette'],
      ['component:mystery-box-reveal', 'Mystery Box Reveal'],
    ],
  },
]

const TOTAL = CATALOG.reduce((n, s) => n + s.entries.length, 0)

// ─── DevCatalog ──────────────────────────────────────────────────────────────

export default function DevCatalog({
  onSelect,
  initialExpandedSections,
}: {
  onSelect: (key: string, sectionIndex: number) => void
  initialExpandedSections?: Set<number>
}) {
  const defaultValue = Array.from(initialExpandedSections ?? new Set()).map(String)

  // ── Catalog grid ───────────────────────────────────────────────────────
  return (
    <Animated.View layout={AccordionLayoutTransition} className="w-full gap-1 mb-2.5 mt-2">
      <Text className="text-xs font-black text-muted uppercase tracking-wider text-center mb-1">
        Dev Catalog ({TOTAL} previews)
      </Text>
      <Accordion selectionMode="multiple" defaultValue={defaultValue} hideSeparator>
        {CATALOG.map((section, i) => (
          <Accordion.Item key={section.title} value={String(i)} className="mb-2">
            <Accordion.Trigger className="flex-row items-center justify-between bg-surface-secondary rounded-frame px-3 py-2.5 border-2 border-border">
              <Text className="text-xs font-black text-foreground uppercase tracking-wider flex-1">
                {section.title} ({section.entries.length})
              </Text>
              <Accordion.Indicator />
            </Accordion.Trigger>
            <Accordion.Content className="flex-row flex-wrap gap-2 mt-2 w-full">
              {section.entries.map(([key, label]) => (
                <Button
                  key={key}
                  variant="secondary"
                  size="sm"
                  className="flex-1 basis-[47%]"
                  onPress={() => onSelect(key, i)}
                >
                  <Button.Label>{label}</Button.Label>
                </Button>
              ))}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion>
    </Animated.View>
  )
}
