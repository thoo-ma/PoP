import { BREED_MAX_COUNT, breedCost } from '@pop/shared'
import { Button, cn, Skeleton } from 'heroui-native'
import type { ReactNode } from 'react'
import { Image, Text, View } from 'react-native'
import {
  BreedOutcomePanel,
  BreedParentSlot,
  DegenBar,
  LootRouletteCard,
  MysteryBoxCard,
  MysteryBoxRevealModal,
  NFTCard,
  NFTProperties,
  ScreenError,
  ScreenLoader,
} from '@/components'
import {
  badgeLabel,
  breedInfoText,
  breedResultSection,
  bustMessage,
  challengeHeader,
  emptyState,
  errorMessage,
  gridLayout,
  infoBox,
  infoCard,
  inlineError,
  marketplaceItemRow,
  nftDetailCard,
  nftPickerButton,
  nftPickerPlaceholder,
  overlayBadge,
  parentSlotsRow,
  phaseContainer,
  phaseContent,
  phaseText,
  recordingIndicator,
  repairAmountBox,
  repairFullEnergy,
  repairSuccess,
  resultCard,
  screenContainer,
  skeletonCard,
  statusBadge,
  tactileButton,
  tactileButtonText,
  timerText,
  typeBadge,
} from '@/styles'
import { formatDisplayName } from '@/utils'
import {
  MOCK_BOXES,
  MOCK_NFT_COMMON,
  MOCK_NFT_COOLDOWN,
  MOCK_NFT_LEGENDARY,
  MOCK_NFT_LISTED,
  MOCK_NFT_MAXBREED,
  MOCK_NFT_NO_ENERGY,
  MOCK_NFT_READY,
  MOCK_NFT_TRANSCENDENT,
  MOCK_NFT_WITH_POINTS,
  mockMysteryBox,
} from './devMockData'

// ─── Back button wrapper ─────────────────────────────────────────────────────

function PreviewShell({ children, onBack }: { children: ReactNode; onBack: () => void }) {
  return (
    <View className="flex-1">
      {children}
      <View className="absolute bottom-10 left-6 right-6">
        <Button
          variant="ghost"
          feedbackVariant="none"
          onPress={onBack}
          className={cn(tactileButton({ variant: 'primary' }), 'w-full')}
        >
          <Button.Label className={tactileButtonText({ variant: 'primary' })}>
            ← Back to Catalog
          </Button.Label>
        </Button>
      </View>
    </View>
  )
}

/** Static mock challenge header — reused by Poop phase previews. */
function MockChallengeHeader() {
  const nft = MOCK_NFT_READY
  const s = challengeHeader()
  return (
    <View className={s.root()}>
      <Image source={{ uri: nft.image_url }} className={s.avatar()} resizeMode="cover" />
      <View className={s.info()}>
        <Text className={s.name()}>{formatDisplayName(nft.name)}</Text>
        <Text className={s.subtitle()}>
          Lv {nft.level} · {nft.type}
        </Text>
      </View>
    </View>
  )
}

/** Centred container for poop phase previews (matches the real phase layout). */
function PhaseShell({ children, onBack }: { children: ReactNode; onBack: () => void }) {
  return (
    <PreviewShell onBack={onBack}>
      <View className="flex-1 bg-background items-center justify-center px-5 pb-32">
        {children}
      </View>
    </PreviewShell>
  )
}

// ─── Main renderer ───────────────────────────────────────────────────────────

export default function renderDevPreview(key: string, dismiss: () => void): ReactNode {
  // ════════════════════════════════════════════════════════════════════════════
  // SHARED
  // ════════════════════════════════════════════════════════════════════════════

  if (key === 'shared:screen-error')
    return (
      <PreviewShell onBack={dismiss}>
        <ScreenError
          title="Vault"
          message="Failed to load NFTs: something went wrong"
          onRetry={dismiss}
        />
      </PreviewShell>
    )

  if (key === 'shared:screen-loader')
    return (
      <PreviewShell onBack={dismiss}>
        <ScreenLoader title="Vault" message="Loading your collection..." />
      </PreviewShell>
    )

  if (key === 'shared:error-boundary')
    return (
      <PreviewShell onBack={dismiss}>
        <ScreenError
          title="ErrorBoundary"
          message="Simulated crash: something broke!"
          onRetry={dismiss}
        />
      </PreviewShell>
    )

  // ════════════════════════════════════════════════════════════════════════════
  // BREED
  // ════════════════════════════════════════════════════════════════════════════

  if (key === 'breed:need-2-nfts')
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'default', padTop: 'md' })}>
          <View className={infoBox()}>
            <Text className={breedInfoText()}>
              You need at least two NFTs in your wallet to breed. Acquire or mint another NFT, then
              come back to start breeding.
            </Text>
          </View>
        </View>
      </PreviewShell>
    )

  if (key === 'breed:idle-no-parents') {
    const slotsRow = parentSlotsRow()
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'default', padTop: 'md' })}>
          <View className="w-full flex-1 px-5">
            <View className={slotsRow.root()}>
              <BreedParentSlot nft={null} label="Choose Parent 1" onPress={() => {}} />
              <View className={slotsRow.separator()}>
                <Text className={slotsRow.separatorText()}>×</Text>
              </View>
              <BreedParentSlot nft={null} label="Choose Parent 2" onPress={() => {}} />
            </View>
            <View className={cn(infoBox(), 'mb-6 items-center')}>
              <Text className={breedInfoText({ size: 'hint' })}>
                Select both parents to see outcome probabilities
              </Text>
            </View>
            <Button
              variant="ghost"
              feedbackVariant="none"
              isDisabled
              className={cn(tactileButton({ variant: 'primary' }), 'w-full')}
            >
              <Button.Label className={tactileButtonText({ variant: 'primary' })}>
                Breed
              </Button.Label>
            </Button>
          </View>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'breed:parents-selected') {
    const p1 = MOCK_NFT_READY
    const p2 = MOCK_NFT_COMMON
    const cost =
      breedCost(p1.breed_count ?? 0, p1.rarity) + breedCost(p2.breed_count ?? 0, p2.rarity)
    const slotsRow = parentSlotsRow()
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'default', padTop: 'md' })}>
          <View className="w-full flex-1 px-5">
            <View className={slotsRow.root()}>
              <BreedParentSlot nft={p1} label="Choose Parent 1" onPress={() => {}} />
              <View className={slotsRow.separator()}>
                <Text className={slotsRow.separatorText()}>×</Text>
              </View>
              <BreedParentSlot nft={p2} label="Choose Parent 2" onPress={() => {}} />
            </View>
            <BreedOutcomePanel r1={p1.rarity} r2={p2.rarity} />
            <DegenBar baseCost={cost} onDegenChange={() => {}} />
            <Button
              variant="ghost"
              feedbackVariant="none"
              className={cn(tactileButton({ variant: 'primary' }), 'w-full mt-4')}
              onPress={() => {}}
            >
              <Button.Label className={tactileButtonText({ variant: 'primary' })}>
                Breed ({cost} POOP)
              </Button.Label>
            </Button>
          </View>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'breed:at-limit') {
    const p1 = MOCK_NFT_MAXBREED
    const p2 = MOCK_NFT_COMMON
    const slotsRow = parentSlotsRow()
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'default', padTop: 'md' })}>
          <View className="w-full flex-1 px-5">
            <View className={slotsRow.root()}>
              <BreedParentSlot nft={p1} label="Choose Parent 1" onPress={() => {}} />
              <View className={slotsRow.separator()}>
                <Text className={slotsRow.separatorText()}>×</Text>
              </View>
              <BreedParentSlot nft={p2} label="Choose Parent 2" onPress={() => {}} />
            </View>
            <BreedOutcomePanel r1={p1.rarity} r2={p2.rarity} />
            <Text className={errorMessage()}>
              One of the selected NFTs has reached its max breed count ({BREED_MAX_COUNT}) and
              cannot be bred again.
            </Text>
            <Button
              variant="ghost"
              feedbackVariant="none"
              isDisabled
              className={cn(tactileButton({ variant: 'primary' }), 'w-full')}
            >
              <Button.Label className={tactileButtonText({ variant: 'primary' })}>
                Breed
              </Button.Label>
            </Button>
          </View>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'breed:insufficient-poop') {
    const p1 = MOCK_NFT_READY
    const p2 = MOCK_NFT_LEGENDARY
    const cost =
      breedCost(p1.breed_count ?? 0, p1.rarity) + breedCost(p2.breed_count ?? 0, p2.rarity)
    const slotsRow = parentSlotsRow()
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'default', padTop: 'md' })}>
          <View className="w-full flex-1 px-5">
            <View className={slotsRow.root()}>
              <BreedParentSlot nft={p1} label="Choose Parent 1" onPress={() => {}} />
              <View className={slotsRow.separator()}>
                <Text className={slotsRow.separatorText()}>×</Text>
              </View>
              <BreedParentSlot nft={p2} label="Choose Parent 2" onPress={() => {}} />
            </View>
            <BreedOutcomePanel r1={p1.rarity} r2={p2.rarity} />
            <Text className={errorMessage()}>
              Insufficient POOP — you need {cost} POOP to breed.
            </Text>
            <Button
              variant="ghost"
              feedbackVariant="none"
              isDisabled
              className={cn(tactileButton({ variant: 'primary' }), 'w-full')}
            >
              <Button.Label className={tactileButtonText({ variant: 'primary' })}>
                Breed ({cost} POOP)
              </Button.Label>
            </Button>
          </View>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'breed:bust-inline') {
    const bm = bustMessage()
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'default', padTop: 'md' })}>
          <View className="w-full flex-1 px-5 items-center justify-center">
            <View className={bm.root()}>
              <Text className={bm.title()}>BUST</Text>
              <Text className={bm.detail()}>You lost 120 POOP — better luck next time!</Text>
            </View>
          </View>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'breed:result') {
    const box = mockMysteryBox('rare', 1)
    const result = breedResultSection()
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'default', padTop: 'md' })}>
          <View className="w-full flex-1 px-5 items-center pt-10">
            <View className={result.root()}>
              <Text className={result.title()}>Mystery Box Earned!</Text>
              <View className={result.parentsRow()}>
                <Image
                  source={{ uri: MOCK_NFT_READY.image_url }}
                  className={result.parentImage()}
                />
                <Text className={result.multiplyText()}>×</Text>
                <Image
                  source={{ uri: MOCK_NFT_COMMON.image_url }}
                  className={result.parentImage()}
                />
                <Text className={result.arrowText()}>→</Text>
              </View>
              <MysteryBoxCard rarity={box.rarity} box={box} imageUrl={box.image_url} />
              <Button
                variant="ghost"
                feedbackVariant="none"
                className={cn(tactileButton({ variant: 'primary' }), 'w-full mt-4')}
                onPress={() => {}}
              >
                <Button.Label className={tactileButtonText({ variant: 'primary' })}>
                  Breed Again
                </Button.Label>
              </Button>
            </View>
          </View>
        </View>
      </PreviewShell>
    )
  }

  // ════════════════════════════════════════════════════════════════════════════
  // REPAIR
  // ════════════════════════════════════════════════════════════════════════════

  if (key === 'repair:no-nft-placeholder') {
    const ph = nftPickerPlaceholder()
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'default', padTop: 'md' })}>
          <View className="w-full items-center px-5 pt-10">
            <Button variant="ghost" className={nftPickerButton()} onPress={() => {}}>
              <Text className={ph.icon()}>+</Text>
              <Text className={ph.label()}>Select NFT from Vault</Text>
            </Button>
          </View>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'repair:no-nfts') {
    const ph = nftPickerPlaceholder()
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'default', padTop: 'md' })}>
          <View className="w-full items-center px-5 pt-10">
            <Button variant="ghost" isDisabled className={nftPickerButton()} onPress={() => {}}>
              <Text className={ph.icon()}>+</Text>
              <Text className={ph.label()}>No NFTs Available</Text>
            </Button>
          </View>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'repair:nft-selected') {
    const nft = { ...MOCK_NFT_READY, energy: 40 }
    const detailStyles = nftDetailCard()
    const ra = repairAmountBox()
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'default', padTop: 'md' })}>
          <View className="w-full items-center px-5">
            <View className={cn(detailStyles.root(), 'w-70 bg-surface border-outline')}>
              <View className={detailStyles.imageWrap()}>
                <Image
                  source={{ uri: nft.image_url }}
                  className={detailStyles.image()}
                  resizeMode="cover"
                />
                <View className={cn(overlayBadge({ position: 'topLeft' }), 'bg-badge-level')}>
                  <Text className={cn(badgeLabel(), 'tracking-wide')}>Lv {nft.level}</Text>
                </View>
                <View
                  className={cn(
                    overlayBadge({ position: 'topRight' }),
                    typeBadge({ type: nft.type }),
                  )}
                >
                  <Text className={cn(badgeLabel({ size: 'sm' }), 'tracking-wide')}>
                    {nft.type.toUpperCase()}
                  </Text>
                </View>
              </View>
              <View className={cn(detailStyles.content(), 'p-4')}>
                <Text className={cn(detailStyles.title(), 'text-on-surface mb-3')}>
                  {formatDisplayName(nft.name)}
                </Text>
                <NFTProperties
                  efficiency={nft.efficiency}
                  resilience={nft.resilience}
                  comfort={nft.comfort}
                  luck={nft.luck}
                  energy={nft.energy + 30}
                  mode="compact"
                />
              </View>
            </View>
            <View className={cn(infoBox(), 'mb-5 mt-5')}>
              <Text className={ra.title()}>Repair Amount</Text>
              <View className={ra.valueWrap()}>
                <Text className={ra.value()}>+30%</Text>
              </View>
            </View>
            <DegenBar baseCost={42} onDegenChange={() => {}} />
            <Button
              variant="ghost"
              feedbackVariant="none"
              className={cn(tactileButton({ variant: 'primary' }), 'w-full mt-4')}
              onPress={() => {}}
            >
              <Button.Label className={tactileButtonText({ variant: 'primary' })}>
                Repair (42 POOP)
              </Button.Label>
            </Button>
          </View>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'repair:full-energy') {
    const rfe = repairFullEnergy()
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'default', padTop: 'md' })}>
          <View className="w-full items-center px-5 pt-10">
            <View className={rfe.root()}>
              <Button
                variant="ghost"
                feedbackVariant="none"
                className={cn(tactileButton({ variant: 'outline' }), 'w-full')}
                onPress={() => {}}
              >
                <Button.Label className={tactileButtonText({ variant: 'outline' })}>
                  This NFT is at full energy!
                </Button.Label>
              </Button>
            </View>
          </View>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'repair:success') {
    const rs = repairSuccess()
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'default', padTop: 'md' })}>
          <View className="w-full items-center px-5">
            <View className={rs.root()}>
              <Text className={rs.text()}>Repair Complete!</Text>
              <Text className={rs.text()}>Energy: 100%</Text>
              <Text className={rs.text()}>-42 POOP spent</Text>
              <Button
                variant="ghost"
                feedbackVariant="none"
                className={cn(tactileButton({ variant: 'outline' }), 'w-full')}
                onPress={() => {}}
              >
                <Button.Label className={tactileButtonText({ variant: 'outline' })}>
                  Repair Another NFT
                </Button.Label>
              </Button>
            </View>
          </View>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'repair:bust-inline') {
    const bm = bustMessage()
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'default', padTop: 'md' })}>
          <View className="w-full flex-1 px-5 items-center justify-center">
            <View className={bm.root()}>
              <Text className={bm.title()}>BUST</Text>
              <Text className={bm.detail()}>You lost 42 POOP — better luck next time!</Text>
            </View>
          </View>
        </View>
      </PreviewShell>
    )
  }

  // ════════════════════════════════════════════════════════════════════════════
  // POOP — game phases
  // ════════════════════════════════════════════════════════════════════════════

  if (key === 'poop:no-nfts') {
    const ph = nftPickerPlaceholder()
    return (
      <PreviewShell onBack={dismiss}>
        <View className="flex-1 bg-background items-center pt-[100px] px-5">
          <Button
            variant="ghost"
            feedbackVariant="none"
            isDisabled
            className={nftPickerButton()}
            onPress={() => {}}
          >
            <Text className={ph.icon()}>+</Text>
            <Text className={ph.label()}>No NFTs Available</Text>
          </Button>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'poop:idle-ready') {
    const nft = MOCK_NFT_READY
    const detailStyles = nftDetailCard()
    return (
      <PreviewShell onBack={dismiss}>
        <View className="flex-1 bg-background items-center pt-[100px] px-5">
          <View className={cn(detailStyles.root(), 'w-70 bg-surface border-outline')}>
            <View className={detailStyles.imageWrap()}>
              <Image
                source={{ uri: nft.image_url }}
                className={detailStyles.image()}
                resizeMode="cover"
              />
              <View className={cn(overlayBadge({ position: 'topLeft' }), 'bg-badge-level')}>
                <Text className={cn(badgeLabel(), 'tracking-wide')}>Lv {nft.level}</Text>
              </View>
              <View
                className={cn(
                  overlayBadge({ position: 'topRight' }),
                  typeBadge({ type: nft.type }),
                )}
              >
                <Text className={cn(badgeLabel({ size: 'sm' }), 'tracking-wide')}>
                  {nft.type.toUpperCase()}
                </Text>
              </View>
            </View>
            <View className={cn(detailStyles.content(), 'p-4')}>
              <Text className={cn(detailStyles.title(), 'text-on-surface mb-3')}>
                {formatDisplayName(nft.name)}
              </Text>
              <NFTProperties
                efficiency={nft.efficiency}
                resilience={nft.resilience}
                comfort={nft.comfort}
                luck={nft.luck}
                energy={nft.energy}
                mode="compact"
              />
            </View>
          </View>
          <Button
            variant="ghost"
            feedbackVariant="none"
            className={cn(tactileButton({ variant: 'primary' }), 'w-full mt-5')}
            onPress={() => {}}
          >
            <Button.Label className={tactileButtonText({ variant: 'primary' })}>Poop</Button.Label>
          </Button>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'poop:idle-cooldown') {
    const nft = MOCK_NFT_COOLDOWN
    const detailStyles = nftDetailCard()
    return (
      <PreviewShell onBack={dismiss}>
        <View className="flex-1 bg-background items-center pt-[100px] px-5">
          <View className={cn(detailStyles.root(), 'w-70 bg-surface border-outline')}>
            <View className={detailStyles.imageWrap()}>
              <Image
                source={{ uri: nft.image_url }}
                className={detailStyles.image()}
                resizeMode="cover"
              />
            </View>
            <View className={cn(detailStyles.content(), 'p-4')}>
              <Text className={cn(detailStyles.title(), 'text-on-surface mb-3')}>
                {formatDisplayName(nft.name)}
              </Text>
              <NFTProperties
                efficiency={nft.efficiency}
                resilience={nft.resilience}
                comfort={nft.comfort}
                luck={nft.luck}
                energy={nft.energy}
                mode="compact"
              />
            </View>
          </View>
          <Button
            variant="ghost"
            feedbackVariant="none"
            isDisabled
            className={cn(tactileButton({ variant: 'primary' }), 'w-full mt-5')}
            onPress={() => {}}
          >
            <Button.Label className={tactileButtonText({ variant: 'primary' })}>
              Ready in 2h 15m
            </Button.Label>
          </Button>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'poop:idle-no-energy') {
    const nft = MOCK_NFT_NO_ENERGY
    const detailStyles = nftDetailCard()
    return (
      <PreviewShell onBack={dismiss}>
        <View className="flex-1 bg-background items-center pt-[100px] px-5">
          <View className={cn(detailStyles.root(), 'w-70 bg-surface border-outline')}>
            <View className={detailStyles.imageWrap()}>
              <Image
                source={{ uri: nft.image_url }}
                className={detailStyles.image()}
                resizeMode="cover"
              />
            </View>
            <View className={cn(detailStyles.content(), 'p-4')}>
              <Text className={cn(detailStyles.title(), 'text-on-surface mb-3')}>
                {formatDisplayName(nft.name)}
              </Text>
              <NFTProperties
                efficiency={nft.efficiency}
                resilience={nft.resilience}
                comfort={nft.comfort}
                luck={nft.luck}
                energy={0}
                mode="compact"
              />
            </View>
          </View>
          <Button
            variant="ghost"
            feedbackVariant="none"
            isDisabled
            className={cn(tactileButton({ variant: 'primary' }), 'w-full mt-5')}
            onPress={() => {}}
          >
            <Button.Label className={tactileButtonText({ variant: 'primary' })}>
              No Energy
            </Button.Label>
          </Button>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'poop:countdown') {
    const pt = phaseText()
    return (
      <PhaseShell onBack={dismiss}>
        <View className={phaseContainer()}>
          <MockChallengeHeader />
          <View className={phaseContent()}>
            <Text className={timerText({ status: 'neutral' })}>3</Text>
            <Text className={pt.hint()}>Get ready…</Text>
          </View>
          <Button
            variant="ghost"
            feedbackVariant="none"
            className={cn(tactileButton({ variant: 'outline' }), 'w-full')}
            onPress={() => {}}
          >
            <Button.Label className={tactileButtonText({ variant: 'outline' })}>
              Cancel
            </Button.Label>
          </Button>
        </View>
      </PhaseShell>
    )
  }

  if (key === 'poop:immobility-ok') {
    const badge = statusBadge({ status: 'ok' })
    return (
      <PhaseShell onBack={dismiss}>
        <View className={phaseContainer()}>
          <MockChallengeHeader />
          <View className={phaseContent()}>
            <Text className={timerText({ status: 'normal' })}>8.5s</Text>
            <View className={badge.root()}>
              <Text className={badge.label()}>Hold still</Text>
            </View>
          </View>
          <Button
            variant="ghost"
            feedbackVariant="none"
            className={cn(tactileButton({ variant: 'outline' }), 'w-full')}
            onPress={() => {}}
          >
            <Button.Label className={tactileButtonText({ variant: 'outline' })}>
              Cancel
            </Button.Label>
          </Button>
        </View>
      </PhaseShell>
    )
  }

  if (key === 'poop:immobility-warning') {
    const badge = statusBadge({ status: 'warning' })
    return (
      <PhaseShell onBack={dismiss}>
        <View className={phaseContainer()}>
          <MockChallengeHeader />
          <View className={phaseContent()}>
            <Text className={timerText({ status: 'danger' })}>6.2s</Text>
            <View className={badge.root()}>
              <Text className={badge.label()}>Movement detected!</Text>
            </View>
          </View>
          <Button
            variant="ghost"
            feedbackVariant="none"
            className={cn(tactileButton({ variant: 'outline' }), 'w-full')}
            onPress={() => {}}
          >
            <Button.Label className={tactileButtonText({ variant: 'outline' })}>
              Cancel
            </Button.Label>
          </Button>
        </View>
      </PhaseShell>
    )
  }

  if (key === 'poop:prompt') {
    const pt = phaseText()
    return (
      <PhaseShell onBack={dismiss}>
        <View className={phaseContainer()}>
          <MockChallengeHeader />
          <View className={infoCard()}>
            <Text className={pt.promptTitle()}>Immobility confirmed!</Text>
            <Text className={pt.promptSubtitle()}>Now record the flush sound</Text>
          </View>
          <Button
            variant="ghost"
            feedbackVariant="none"
            className={cn(tactileButton({ variant: 'primary' }), 'w-full')}
            onPress={() => {}}
          >
            <Button.Label className={tactileButtonText({ variant: 'primary' })}>
              Start Recording
            </Button.Label>
          </Button>
          <Button
            variant="ghost"
            feedbackVariant="none"
            className={cn(tactileButton({ variant: 'outline' }), 'w-full')}
            onPress={() => {}}
          >
            <Button.Label className={tactileButtonText({ variant: 'outline' })}>
              Cancel
            </Button.Label>
          </Button>
        </View>
      </PhaseShell>
    )
  }

  if (key === 'poop:recording') {
    const rec = recordingIndicator()
    return (
      <PhaseShell onBack={dismiss}>
        <View className={phaseContainer()}>
          <MockChallengeHeader />
          <View className={infoCard()}>
            <View className={rec.root()}>
              <View className={rec.dot()} />
              <Text className={rec.label()}>Recording…</Text>
            </View>
            <Button
              variant="ghost"
              feedbackVariant="none"
              className={cn(tactileButton({ variant: 'primary' }), 'w-full')}
              onPress={() => {}}
            >
              <Button.Label className={tactileButtonText({ variant: 'primary' })}>
                Stop
              </Button.Label>
            </Button>
          </View>
          <Button
            variant="ghost"
            feedbackVariant="none"
            className={cn(tactileButton({ variant: 'outline' }), 'w-full')}
            onPress={() => {}}
          >
            <Button.Label className={tactileButtonText({ variant: 'outline' })}>
              Cancel
            </Button.Label>
          </Button>
        </View>
      </PhaseShell>
    )
  }

  if (key === 'poop:result-not-detected') {
    const card = resultCard({ status: 'failure' })
    return (
      <PhaseShell onBack={dismiss}>
        <View className={phaseContainer()}>
          <MockChallengeHeader />
          <View className={card.root()}>
            <Text className={card.title()}>Flush not detected</Text>
            <Text className={card.detail()}>Confidence: 23%</Text>
          </View>
          <Button
            variant="ghost"
            feedbackVariant="none"
            className={cn(tactileButton({ variant: 'primary' }), 'w-full')}
            onPress={() => {}}
          >
            <Button.Label className={tactileButtonText({ variant: 'primary' })}>
              Try Again
            </Button.Label>
          </Button>
        </View>
      </PhaseShell>
    )
  }

  if (key === 'poop:result-success') {
    const card = resultCard({ status: 'success' })
    return (
      <PhaseShell onBack={dismiss}>
        <View className={phaseContainer()}>
          <MockChallengeHeader />
          <View className={card.root()}>
            <Text className={card.title()}>Flush confirmed!</Text>
            <Text className={card.detail()}>Energy: 80 → 72</Text>
            <Text className={card.detail()}>+15 XP</Text>
            <Text className={card.detail()}>Level Up! Now Lv 6</Text>
            <Text className={card.detail()}>+8 POOP</Text>
          </View>
          <Button
            variant="ghost"
            feedbackVariant="none"
            className={cn(tactileButton({ variant: 'primary' }), 'w-full')}
            onPress={() => {}}
          >
            <Button.Label className={tactileButtonText({ variant: 'primary' })}>
              Continue →
            </Button.Label>
          </Button>
        </View>
      </PhaseShell>
    )
  }

  if (key === 'poop:result-rate-limit') {
    const card = resultCard({ status: 'warning' })
    return (
      <PhaseShell onBack={dismiss}>
        <View className={phaseContainer()}>
          <MockChallengeHeader />
          <View className={card.root()}>
            <Text className={card.title()}>Daily limit reached</Text>
            <Text className={card.detail()}>
              You've used all 10 daily detections. Come back tomorrow!
            </Text>
          </View>
          <Button
            variant="ghost"
            feedbackVariant="none"
            className={cn(tactileButton({ variant: 'primary' }), 'w-full')}
            onPress={() => {}}
          >
            <Button.Label className={tactileButtonText({ variant: 'primary' })}>Done</Button.Label>
          </Button>
        </View>
      </PhaseShell>
    )
  }

  if (key === 'poop:result-error') {
    const card = resultCard({ status: 'warning' })
    return (
      <PhaseShell onBack={dismiss}>
        <View className={phaseContainer()}>
          <MockChallengeHeader />
          <View className={card.root()}>
            <Text className={card.title()}>Something went wrong</Text>
            <Text className={card.detail()}>Network error: request timed out</Text>
          </View>
          <Button
            variant="ghost"
            feedbackVariant="none"
            className={cn(tactileButton({ variant: 'primary' }), 'w-full')}
            onPress={() => {}}
          >
            <Button.Label className={tactileButtonText({ variant: 'primary' })}>
              Try Again
            </Button.Label>
          </Button>
        </View>
      </PhaseShell>
    )
  }

  // ════════════════════════════════════════════════════════════════════════════
  // VAULT
  // ════════════════════════════════════════════════════════════════════════════

  if (key === 'vault:boxes-loading') {
    const skeleton = skeletonCard()
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'surface', padTop: 'lg' })}>
          <View className={cn(gridLayout().wrapper(), 'p-4')}>
            {[0, 1, 2, 3].map((i) => (
              <View key={i} className={cn(gridLayout().item(), 'mb-3')}>
                <Skeleton className={skeleton.image()} />
                <Skeleton className={skeleton.titleLine()} />
                <Skeleton className={skeleton.subtitleLine()} />
              </View>
            ))}
          </View>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'vault:boxes-error') {
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'surface', padTop: 'lg' })}>
          <View className={inlineError().root()}>
            <Text className={inlineError().text()}>
              Failed to load mystery boxes: Network error
            </Text>
          </View>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'vault:nft-with-points') {
    const nft = MOCK_NFT_WITH_POINTS
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'surface', padTop: 'lg' })}>
          <View className="px-5 pt-5 w-[55%]">
            <NFTCard
              nft={nft}
              action={
                <Button
                  variant="ghost"
                  feedbackVariant="none"
                  className={cn(tactileButton({ variant: 'secondary', size: 'sm' }), 'mt-1')}
                  onPress={() => {}}
                >
                  <Button.Label className={tactileButtonText({ variant: 'secondary', size: 'sm' })}>
                    Allocate {nft.stat_points} pts
                  </Button.Label>
                </Button>
              }
            />
          </View>
        </View>
      </PreviewShell>
    )
  }

  // ════════════════════════════════════════════════════════════════════════════
  // MARKETPLACE
  // ════════════════════════════════════════════════════════════════════════════

  if (key === 'marketplace:loading') {
    const skeleton = skeletonCard()
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'surface', padTop: 'lg' })}>
          <View className={cn(gridLayout().wrapper(), 'p-4')}>
            {[0, 1, 2, 3].map((i) => (
              <View key={i} className={cn(gridLayout().item(), 'mb-3')}>
                <Skeleton className={skeleton.image()} />
                <Skeleton className={skeleton.titleLine()} />
                <Skeleton className={skeleton.subtitleLine()} />
              </View>
            ))}
          </View>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'marketplace:empty-sell') {
    const es = emptyState()
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'surface', padTop: 'lg' })}>
          <View className={cn(es.root(), 'py-15 w-full px-5')}>
            <Text className={es.title()}>No active listings</Text>
            <Text className={cn(es.detail(), 'mt-1 leading-5')}>
              You haven't listed any NFTs yet.
            </Text>
          </View>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'marketplace:buy-card') {
    const nft = MOCK_NFT_LISTED
    const itemRow = marketplaceItemRow()
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'surface', padTop: 'lg' })}>
          <View className="px-5 pt-5 w-[55%]">
            <NFTCard
              nft={nft}
              action={
                <View className={itemRow.root()}>
                  <Text className={itemRow.price()}>{nft.price}</Text>
                  <Button
                    variant="ghost"
                    feedbackVariant="none"
                    onPress={() => {}}
                    className={tactileButton({ variant: 'primary', size: 'sm' })}
                  >
                    <Button.Label className={tactileButtonText({ variant: 'primary', size: 'sm' })}>
                      Buy
                    </Button.Label>
                  </Button>
                </View>
              }
            />
          </View>
        </View>
      </PreviewShell>
    )
  }

  // ════════════════════════════════════════════════════════════════════════════
  // STANDALONE COMPONENTS
  // ════════════════════════════════════════════════════════════════════════════

  if (key === 'component:nft-card') {
    const gl = gridLayout()
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'surface', padTop: 'lg' })}>
          <View className="px-3 pt-3 w-full">
            <View className={gl.row()}>
              <View className={gl.item()}>
                <NFTCard nft={MOCK_NFT_COMMON} />
              </View>
              <View className={gl.item()}>
                <NFTCard nft={MOCK_NFT_READY} />
              </View>
            </View>
            <View className={gl.row()}>
              <View className={gl.item()}>
                <NFTCard nft={MOCK_NFT_LEGENDARY} />
              </View>
              <View className={gl.item()}>
                <NFTCard nft={MOCK_NFT_TRANSCENDENT} />
              </View>
            </View>
          </View>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'component:mystery-box-card') {
    const { rareWithCount, legendaryWithCount, commonEmpty, transcendentEmpty } = MOCK_BOXES
    const gl = gridLayout()
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'surface', padTop: 'lg' })}>
          <View className="px-3 pt-3 w-full">
            <View className={gl.row()}>
              <View className={gl.item()}>
                <MysteryBoxCard
                  rarity={rareWithCount.box.rarity}
                  box={rareWithCount.box}
                  imageUrl={rareWithCount.box.image_url}
                  count={rareWithCount.count}
                />
              </View>
              <View className={gl.item()}>
                <MysteryBoxCard
                  rarity={legendaryWithCount.box.rarity}
                  box={legendaryWithCount.box}
                  imageUrl={legendaryWithCount.box.image_url}
                  count={legendaryWithCount.count}
                />
              </View>
            </View>
            <View className={gl.row()}>
              <View className={gl.item()}>
                <MysteryBoxCard
                  rarity={commonEmpty.rarity}
                  box={commonEmpty.box}
                  imageUrl="https://placehold.co/400x400/9CA3AF/white?text=Common%0ABox"
                  count={commonEmpty.count}
                />
              </View>
              <View className={gl.item()}>
                <MysteryBoxCard
                  rarity={transcendentEmpty.rarity}
                  box={transcendentEmpty.box}
                  imageUrl="https://placehold.co/400x400/EC4899/white?text=Trans%0ABox"
                  count={transcendentEmpty.count}
                />
              </View>
            </View>
          </View>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'component:degen-bar') {
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'default', padTop: 'md' })}>
          <View className="w-full px-5 pt-10">
            <DegenBar baseCost={500} onDegenChange={() => {}} />
          </View>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'component:loot-roulette') {
    return (
      <PreviewShell onBack={dismiss}>
        <View className="flex-1 bg-background items-center justify-center px-6 pb-32">
          <LootRouletteCard lootRollId="mock-loot-roll-id" onDone={dismiss} />
        </View>
      </PreviewShell>
    )
  }

  if (key === 'component:mystery-box-reveal') {
    return <MysteryBoxRevealModal visible nft={MOCK_NFT_READY} onClose={dismiss} />
  }

  // Fallback
  return (
    <PreviewShell onBack={dismiss}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-on-surface font-bold">Unknown preview: {key}</Text>
      </View>
    </PreviewShell>
  )
}
