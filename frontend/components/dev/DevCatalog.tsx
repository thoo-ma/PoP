import { Button, cn } from 'heroui-native'
import { useCallback, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { tactileButton, tactileButtonText } from '@/styles'
import renderDevPreview from './DevPreviewRenderer'

// ─── Catalog definition ──────────────────────────────────────────────────────

type CatalogEntry = [key: string, label: string]

interface CatalogSection {
  title: string
  entries: CatalogEntry[]
}

const CATALOG: CatalogSection[] = [
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
    ],
  },
  {
    title: 'Vault',
    entries: [
      ['vault:boxes-loading', 'Boxes skeleton'],
      ['vault:boxes-error', 'Boxes inline error'],
      ['vault:nft-with-points', 'NFT with stat points'],
    ],
  },
  {
    title: 'Marketplace',
    entries: [
      ['marketplace:loading', 'Skeleton loading'],
      ['marketplace:empty-sell', 'Empty sell tab'],
      ['marketplace:buy-card', 'Buy card with price'],
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

// ─── Collapsible Section ─────────────────────────────────────────────────────

function Section({
  section,
  expanded,
  onToggle,
  onSelect,
}: {
  section: CatalogSection
  expanded: boolean
  onToggle: () => void
  onSelect: (key: string) => void
}) {
  return (
    <View className="mb-2">
      <Pressable
        onPress={onToggle}
        className="flex-row items-center justify-between bg-surface-container-low rounded-xl px-3 py-2.5 border-2 border-outline"
      >
        <Text className="text-xs font-black text-on-surface uppercase tracking-wider">
          {expanded ? '▼' : '▶'} {section.title} ({section.entries.length})
        </Text>
      </Pressable>
      {expanded && (
        <View className="flex-row flex-wrap gap-2 mt-2">
          {section.entries.map(([key, label]) => (
            <Button
              key={key}
              variant="ghost"
              feedbackVariant="none"
              className={cn(
                tactileButton({ variant: 'default', size: 'sm' }),
                'flex-1 basis-[47%]',
              )}
              onPress={() => onSelect(key)}
            >
              <Button.Label className={tactileButtonText({ variant: 'default', size: 'sm' })}>
                {label}
              </Button.Label>
            </Button>
          ))}
        </View>
      )}
    </View>
  )
}

// ─── DevCatalog ──────────────────────────────────────────────────────────────

export default function DevCatalog() {
  const [activePreview, setActivePreview] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<number>>(() => new Set([0]))

  const dismiss = useCallback(() => setActivePreview(null), [])

  const toggleSection = useCallback((index: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }, [])

  // ── Active preview ─────────────────────────────────────────────────────
  if (activePreview) {
    return renderDevPreview(activePreview, dismiss)
  }

  // ── Catalog grid ───────────────────────────────────────────────────────
  return (
    <View className="w-full gap-1 mb-2.5 mt-2">
      <Text className="text-xs font-black text-outline uppercase tracking-wider text-center mb-1">
        Dev Catalog ({TOTAL} previews)
      </Text>
      {CATALOG.map((section, i) => (
        <Section
          key={section.title}
          section={section}
          expanded={expandedSections.has(i)}
          onToggle={() => toggleSection(i)}
          onSelect={setActivePreview}
        />
      ))}
    </View>
  )
}
