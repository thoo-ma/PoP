import { BREED_MAX_COUNT, breedCost } from '@pop/shared'
import {
  Avatar,
  Button,
  cn,
  Dialog,
  FieldError,
  InputOTP,
  REGEXP_ONLY_DIGITS_AND_CHARS,
  Skeleton,
  Spinner,
} from 'heroui-native'
import type { ReactNode } from 'react'
import { Image, Text, View } from 'react-native'
import {
  AlertBox,
  BreedOutcomePanel,
  BreedParentSlot,
  CountdownPhase,
  DegenBar,
  IdlePhase,
  ImmobilityPhase,
  LootRouletteCard,
  MysteryBoxCard,
  MysteryBoxRevealModal,
  NFTCard,
  NFTDetailCard,
  PromptPhase,
  RecordingPhase,
  ResultsPhase,
  RoulettePhase,
  ScreenError,
  ScreenLoader,
  TactileButton,
} from '@/components'
import { DevMockProvider } from '@/lib/devMock'
import { Breed, Repair } from '@/screens/nft'
import {
  authScreen,
  breedResultSection,
  dialogBody,
  dialogFooter,
  gridLayout,
  infoBox,
  marketplaceItemRow,
  parentSlotsRow,
  profileModal,
  repairAmountBox,
  repairFullEnergy,
  screenContainer,
  signOutDialog,
  skeletonCard,
  tactileButton,
  tactileButtonText,
  walletModal,
} from '@/styles'
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
      <View className="absolute bottom-32 left-6 right-6">
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
  // PROFILE
  // ════════════════════════════════════════════════════════════════════════════

  if (key === 'profile:stats-loading') {
    const p = profileModal()
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'surface' })}>
          <View className={p.scrollContainer()}>
            <View className={p.avatarWrap()}>
              <Avatar size="lg" color="accent" alt="User avatar">
                <Avatar.Fallback>JD</Avatar.Fallback>
              </Avatar>
            </View>
            <Text className={p.username()}>Jane Doe</Text>
            <Text className={p.email()}>jane@example.com</Text>
            <View className={p.statsRow()}>
              <View className={p.statCol()}>
                <Skeleton isLoading className="h-6 w-12 rounded-md">
                  <Text className={p.statValue()}>—</Text>
                </Skeleton>
                <Text className={p.statLabel()}>Detections</Text>
              </View>
              <View className={p.statDivider()} />
              <View className={p.statCol()}>
                <Text className={p.statValue()}>5</Text>
                <Text className={p.statLabel()}>NFTs</Text>
              </View>
              <View className={p.statDivider()} />
              <View className={p.statCol()}>
                <Skeleton isLoading className="h-6 w-12 rounded-md">
                  <Text className={p.statValue()}>—</Text>
                </Skeleton>
                <Text className={p.statLabel()}>Days Active</Text>
              </View>
            </View>
          </View>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'profile:stats-loaded') {
    const p = profileModal()
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'surface' })}>
          <View className={p.scrollContainer()}>
            <View className={p.avatarWrap()}>
              <Avatar size="lg" color="accent" alt="User avatar">
                <Avatar.Fallback>JD</Avatar.Fallback>
              </Avatar>
            </View>
            <Text className={p.username()}>Jane Doe</Text>
            <Text className={p.email()}>jane@example.com</Text>
            <View className={p.statsRow()}>
              <View className={p.statCol()}>
                <Text className={p.statValue()}>42</Text>
                <Text className={p.statLabel()}>Detections</Text>
              </View>
              <View className={p.statDivider()} />
              <View className={p.statCol()}>
                <Text className={p.statValue()}>5</Text>
                <Text className={p.statLabel()}>NFTs</Text>
              </View>
              <View className={p.statDivider()} />
              <View className={p.statCol()}>
                <Text className={p.statValue()}>7</Text>
                <Text className={p.statLabel()}>Days Active</Text>
              </View>
            </View>
          </View>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'profile:poop-balance') {
    const w = walletModal()
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'surface' })}>
          <View className="flex-1 items-center justify-center px-6">
            <View className={w.balanceCard()}>
              <Text className={w.balanceLabel()}>POOP Balance</Text>
              <Text className={w.balanceValue()}>
                1337 <Text className={w.currencyLabel()}>POOP</Text>
              </Text>
            </View>
          </View>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'profile:sign-out-dialog') {
    const s = signOutDialog()
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'surface' })}>
          <Dialog
            isOpen
            onOpenChange={(isOpen) => {
              if (!isOpen) dismiss()
            }}
          >
            <Dialog.Portal>
              <Dialog.Overlay />
              <Dialog.Content className={s.content()}>
                <View className={dialogBody()}>
                  <Dialog.Description>Are you sure you want to sign out?</Dialog.Description>
                </View>
                <View className={s.buttonRow()}>
                  <TactileButton variant="outline" onPress={dismiss} className="flex-1">
                    Cancel
                  </TactileButton>
                  <TactileButton variant="default" onPress={dismiss} className="flex-1">
                    Sign Out
                  </TactileButton>
                </View>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'profile:dev-catalog') {
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'surface' })}>
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-lg font-black text-on-surface text-center">
              ← You're looking at it
            </Text>
            <Text className="text-sm font-bold text-on-surface-variant text-center mt-2">
              The Dev Catalog is the accordion on the Profile screen.
            </Text>
          </View>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'profile:error')
    return (
      <PreviewShell onBack={dismiss}>
        <ScreenError title="Profile" message="Failed to load profile data" onRetry={dismiss} />
      </PreviewShell>
    )

  // ════════════════════════════════════════════════════════════════════════════
  // AUTH
  // ════════════════════════════════════════════════════════════════════════════

  if (key === 'auth:invite-code') {
    const s = authScreen()
    return (
      <PreviewShell onBack={dismiss}>
        <View className={s.scrim()}>
          <View className={s.innerRoot()}>
            <View className={s.logoWrap()}>
              <Image
                source={require('@/assets/icon.png')}
                className="w-16 h-16 rounded-2xl"
                resizeMode="contain"
              />
            </View>
            <Text className={s.headline()}>
              ENTER.{'\n'}YOUR.{'\n'}CODE.
            </Text>
            <Text className={s.tagline()}>The world's first tactile proof-of-potty protocol.</Text>
            <View className={s.inputWrap()}>
              <InputOTP
                maxLength={8}
                value=""
                onChange={() => {}}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                inputMode="text"
              >
                <InputOTP.Group>
                  <InputOTP.Slot index={0} />
                  <InputOTP.Slot index={1} />
                  <InputOTP.Slot index={2} />
                  <InputOTP.Slot index={3} />
                </InputOTP.Group>
                <InputOTP.Separator />
                <InputOTP.Group>
                  <InputOTP.Slot index={4} />
                  <InputOTP.Slot index={5} />
                  <InputOTP.Slot index={6} />
                  <InputOTP.Slot index={7} />
                </InputOTP.Group>
              </InputOTP>
            </View>
          </View>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'auth:invite-code-loading') {
    const s = authScreen()
    return (
      <PreviewShell onBack={dismiss}>
        <View className={s.scrim()}>
          <View className={s.innerRoot()}>
            <View className={s.logoWrap()}>
              <Image
                source={require('@/assets/icon.png')}
                className="w-16 h-16 rounded-2xl"
                resizeMode="contain"
              />
            </View>
            <Text className={s.headline()}>
              ENTER.{'\n'}YOUR.{'\n'}CODE.
            </Text>
            <Text className={s.tagline()}>The world's first tactile proof-of-potty protocol.</Text>
            <View className={s.inputWrap()}>
              <InputOTP
                maxLength={8}
                value="ABCD1234"
                onChange={() => {}}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                inputMode="text"
                isDisabled
              >
                <InputOTP.Group>
                  <InputOTP.Slot index={0} />
                  <InputOTP.Slot index={1} />
                  <InputOTP.Slot index={2} />
                  <InputOTP.Slot index={3} />
                </InputOTP.Group>
                <InputOTP.Separator />
                <InputOTP.Group>
                  <InputOTP.Slot index={4} />
                  <InputOTP.Slot index={5} />
                  <InputOTP.Slot index={6} />
                  <InputOTP.Slot index={7} />
                </InputOTP.Group>
              </InputOTP>
            </View>
            <View className={s.actionsWrap()}>
              <TactileButton variant="disabled" isDisabled className="w-full">
                <Spinner size="sm" />
              </TactileButton>
            </View>
          </View>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'auth:invite-code-error') {
    const s = authScreen()
    return (
      <PreviewShell onBack={dismiss}>
        <View className={s.scrim()}>
          <View className={s.innerRoot()}>
            <View className={s.logoWrap()}>
              <Image
                source={require('@/assets/icon.png')}
                className="w-16 h-16 rounded-2xl"
                resizeMode="contain"
              />
            </View>
            <Text className={s.headline()}>
              ENTER.{'\n'}YOUR.{'\n'}CODE.
            </Text>
            <Text className={s.tagline()}>The world's first tactile proof-of-potty protocol.</Text>
            <View className={s.inputWrap()}>
              <InputOTP
                maxLength={8}
                value="INVALID8"
                onChange={() => {}}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                inputMode="text"
                isInvalid
              >
                <InputOTP.Group>
                  <InputOTP.Slot index={0} />
                  <InputOTP.Slot index={1} />
                  <InputOTP.Slot index={2} />
                  <InputOTP.Slot index={3} />
                </InputOTP.Group>
                <InputOTP.Separator />
                <InputOTP.Group>
                  <InputOTP.Slot index={4} />
                  <InputOTP.Slot index={5} />
                  <InputOTP.Slot index={6} />
                  <InputOTP.Slot index={7} />
                </InputOTP.Group>
              </InputOTP>
              <FieldError className={s.fieldError()}>Invalid invite code</FieldError>
            </View>
          </View>
        </View>
      </PreviewShell>
    )
  }

  // ════════════════════════════════════════════════════════════════════════════
  // BREED
  // ════════════════════════════════════════════════════════════════════════════

  if (key === 'breed:loading')
    return (
      <PreviewShell onBack={dismiss}>
        <ScreenLoader title="Breed" message="Loading your NFTs..." />
      </PreviewShell>
    )

  if (key === 'breed:need-2-nfts')
    return (
      <PreviewShell onBack={dismiss}>
        <DevMockProvider
          value={{
            userNFTs: {
              nfts: [MOCK_NFT_READY],
              loading: false,
              error: null,
              refetch: async () => {},
            },
            wallet: { poopBalance: 1000, loading: false, error: null, refetch: async () => {} },
          }}
        >
          <Breed />
        </DevMockProvider>
      </PreviewShell>
    )

  if (key === 'breed:idle-no-parents')
    return (
      <PreviewShell onBack={dismiss}>
        <DevMockProvider
          value={{
            userNFTs: {
              nfts: [MOCK_NFT_READY, MOCK_NFT_COMMON],
              loading: false,
              error: null,
              refetch: async () => {},
            },
            wallet: { poopBalance: 1000, loading: false, error: null, refetch: async () => {} },
          }}
        >
          <Breed />
        </DevMockProvider>
      </PreviewShell>
    )

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
            <View className="mt-4 w-full">
              <AlertBox
                status="warning"
                title="Breed Limit Reached"
                description={`One of the selected NFTs has reached its max breed count (${BREED_MAX_COUNT}) and cannot be bred again.`}
              />
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
            <View className="mt-4 w-full">
              <AlertBox
                status="warning"
                title="Insufficient POOP"
                description={`You need ${cost} POOP to breed.`}
              />
            </View>
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

  if (key === 'breed:bust-inline')
    return (
      <PreviewShell onBack={dismiss}>
        <DevMockProvider
          value={{
            userNFTs: {
              nfts: [MOCK_NFT_READY, MOCK_NFT_COMMON],
              loading: false,
              error: null,
              refetch: async () => {},
            },
            wallet: { poopBalance: 380, loading: false, error: null, refetch: async () => {} },
            breedNFT: {
              breedNFTs: async () => null,
              loading: false,
              error: null,
              bustedResult: { poop_spent: 120, poop_balance: 380 },
            },
          }}
        >
          <Breed />
        </DevMockProvider>
      </PreviewShell>
    )

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

  if (key === 'repair:no-nft-placeholder')
    return (
      <PreviewShell onBack={dismiss}>
        <DevMockProvider
          value={{
            userNFTs: {
              nfts: [MOCK_NFT_READY],
              loading: false,
              error: null,
              refetch: async () => {},
            },
            wallet: { poopBalance: 500, loading: false, error: null, refetch: async () => {} },
          }}
        >
          <Repair />
        </DevMockProvider>
      </PreviewShell>
    )

  if (key === 'repair:no-nfts')
    return (
      <PreviewShell onBack={dismiss}>
        <DevMockProvider
          value={{
            userNFTs: { nfts: [], loading: false, error: null, refetch: async () => {} },
            wallet: { poopBalance: 500, loading: false, error: null, refetch: async () => {} },
          }}
        >
          <Repair />
        </DevMockProvider>
      </PreviewShell>
    )

  if (key === 'repair:nft-selected') {
    const nft = { ...MOCK_NFT_READY, energy: 40 }
    const ra = repairAmountBox()
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'default', padTop: 'md' })}>
          <View className="w-full items-center px-5">
            <NFTDetailCard nft={nft} energy={nft.energy + 30} />
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
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'default', padTop: 'md' })}>
          <View className="w-full items-center px-5">
            <View className="w-full">
              <AlertBox
                status="success"
                title="Repair Complete!"
                description={['Energy: 100%', '-42 POOP spent']}
              >
                <Button
                  variant="ghost"
                  feedbackVariant="none"
                  className={cn(tactileButton({ variant: 'outline' }), 'w-full mt-4')}
                  onPress={() => {}}
                >
                  <Button.Label className={tactileButtonText({ variant: 'outline' })}>
                    Repair Another NFT
                  </Button.Label>
                </Button>
              </AlertBox>
            </View>
          </View>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'repair:bust-inline')
    return (
      <PreviewShell onBack={dismiss}>
        <DevMockProvider
          value={{
            userNFTs: {
              nfts: [MOCK_NFT_READY],
              loading: false,
              error: null,
              refetch: async () => {},
            },
            wallet: { poopBalance: 380, loading: false, error: null, refetch: async () => {} },
            repairNFT: {
              repairNFT: async () => null,
              loading: false,
              error: null,
              insufficientPoopError: null,
              bustedResult: { poop_spent: 42, poop_balance: 380 },
            },
          }}
        >
          <Repair />
        </DevMockProvider>
      </PreviewShell>
    )

  // ════════════════════════════════════════════════════════════════════════════
  // POOP — game phases
  // ════════════════════════════════════════════════════════════════════════════

  if (key === 'poop:no-nfts')
    return (
      <PreviewShell onBack={dismiss}>
        <View className="flex-1 bg-background items-center pt-[100px] px-5">
          <IdlePhase
            nfts={[]}
            selectedIndex={null}
            displayNFT={null}
            buttonDisabled
            buttonLabel="Poop"
            accessibilityLabel="Poop"
            accessibilityHint=""
            immobilityMessage={null}
            onSelectNFT={() => {}}
            onPrev={() => {}}
            onNext={() => {}}
            onPoop={() => {}}
          />
        </View>
      </PreviewShell>
    )

  if (key === 'poop:idle-ready')
    return (
      <PreviewShell onBack={dismiss}>
        <View className="flex-1 bg-background items-center pt-[100px] px-5">
          <IdlePhase
            nfts={[MOCK_NFT_READY]}
            selectedIndex={0}
            displayNFT={MOCK_NFT_READY}
            buttonDisabled={false}
            buttonLabel="Poop"
            accessibilityLabel="Poop"
            accessibilityHint=""
            immobilityMessage={null}
            onSelectNFT={() => {}}
            onPrev={() => {}}
            onNext={() => {}}
            onPoop={() => {}}
          />
        </View>
      </PreviewShell>
    )

  if (key === 'poop:idle-cooldown')
    return (
      <PreviewShell onBack={dismiss}>
        <View className="flex-1 bg-background items-center pt-[100px] px-5">
          <IdlePhase
            nfts={[MOCK_NFT_COOLDOWN]}
            selectedIndex={0}
            displayNFT={MOCK_NFT_COOLDOWN}
            buttonDisabled
            buttonLabel="On Cooldown"
            accessibilityLabel="On Cooldown"
            accessibilityHint=""
            immobilityMessage={null}
            onSelectNFT={() => {}}
            onPrev={() => {}}
            onNext={() => {}}
            onPoop={() => {}}
          />
        </View>
      </PreviewShell>
    )

  if (key === 'poop:idle-no-energy')
    return (
      <PreviewShell onBack={dismiss}>
        <View className="flex-1 bg-background items-center pt-[100px] px-5">
          <IdlePhase
            nfts={[MOCK_NFT_NO_ENERGY]}
            selectedIndex={0}
            displayNFT={MOCK_NFT_NO_ENERGY}
            buttonDisabled
            buttonLabel="No Energy"
            accessibilityLabel="No Energy"
            accessibilityHint=""
            immobilityMessage={null}
            onSelectNFT={() => {}}
            onPrev={() => {}}
            onNext={() => {}}
            onPoop={() => {}}
          />
        </View>
      </PreviewShell>
    )

  if (key === 'poop:countdown')
    return (
      <PhaseShell onBack={dismiss}>
        <CountdownPhase nft={MOCK_NFT_READY} countdownValue={3} onCancel={dismiss} />
      </PhaseShell>
    )

  if (key === 'poop:immobility-ok')
    return (
      <PhaseShell onBack={dismiss}>
        <ImmobilityPhase
          nft={MOCK_NFT_READY}
          remainingTime={8500}
          status="running"
          onCancel={dismiss}
        />
      </PhaseShell>
    )

  if (key === 'poop:immobility-warning')
    return (
      <PhaseShell onBack={dismiss}>
        <ImmobilityPhase
          nft={MOCK_NFT_READY}
          remainingTime={6200}
          status="warning"
          onCancel={dismiss}
        />
      </PhaseShell>
    )

  if (key === 'poop:prompt')
    return (
      <PhaseShell onBack={dismiss}>
        <PromptPhase nft={MOCK_NFT_READY} onStartRecording={() => {}} onCancel={dismiss} />
      </PhaseShell>
    )

  if (key === 'poop:recording')
    return (
      <PhaseShell onBack={dismiss}>
        <RecordingPhase
          nft={MOCK_NFT_READY}
          isRecording
          isAnalyzing={false}
          onStop={() => {}}
          onCancel={dismiss}
        />
      </PhaseShell>
    )

  if (key === 'poop:result-not-detected')
    return (
      <PhaseShell onBack={dismiss}>
        <ResultsPhase
          nft={MOCK_NFT_READY}
          detectionResult={{ detected: false, confidence: 0.32, duration_seconds: 3 }}
          rateLimitError={null}
          detectionError={null}
          poopedEnergy={null}
          poopedXP={null}
          poopedPoop={null}
          actionLoading={false}
          lootRollId={null}
          onRoulette={() => {}}
          onReset={dismiss}
        />
      </PhaseShell>
    )

  if (key === 'poop:result-success')
    return (
      <PhaseShell onBack={dismiss}>
        <ResultsPhase
          nft={MOCK_NFT_READY}
          detectionResult={{ detected: true, confidence: 0.97, duration_seconds: 3 }}
          poopedEnergy={{ from: 80, to: 72 }}
          poopedXP={{ gained: 15, level: 5, leveledUp: false }}
          poopedPoop={{ earned: 8, balance: 388 }}
          rateLimitError={null}
          detectionError={null}
          actionLoading={false}
          lootRollId={null}
          onRoulette={() => {}}
          onReset={dismiss}
        />
      </PhaseShell>
    )

  if (key === 'poop:result-rate-limit')
    return (
      <PhaseShell onBack={dismiss}>
        <ResultsPhase
          nft={MOCK_NFT_READY}
          detectionResult={null}
          rateLimitError={{
            error: 'rate_limit_exceeded',
            message: "You've used all 10 daily detections. Come back tomorrow!",
            limit: 10,
            current_count: 10,
          }}
          detectionError={null}
          poopedEnergy={null}
          poopedXP={null}
          poopedPoop={null}
          actionLoading={false}
          lootRollId={null}
          onRoulette={() => {}}
          onReset={dismiss}
        />
      </PhaseShell>
    )

  if (key === 'poop:result-error')
    return (
      <PhaseShell onBack={dismiss}>
        <ResultsPhase
          nft={MOCK_NFT_READY}
          detectionResult={null}
          rateLimitError={null}
          detectionError="Network error: request timed out"
          poopedEnergy={null}
          poopedXP={null}
          poopedPoop={null}
          actionLoading={false}
          lootRollId={null}
          onRoulette={() => {}}
          onReset={dismiss}
        />
      </PhaseShell>
    )

  if (key === 'poop:analyzing')
    return (
      <PhaseShell onBack={dismiss}>
        <RecordingPhase
          nft={MOCK_NFT_READY}
          isRecording={false}
          isAnalyzing
          onStop={() => {}}
          onCancel={dismiss}
        />
      </PhaseShell>
    )

  if (key === 'poop:roulette')
    return (
      <PreviewShell onBack={dismiss}>
        <View className="flex-1 bg-background">
          <RoulettePhase nft={MOCK_NFT_READY} lootRollId="mock-loot-roll-id" onDone={dismiss} />
        </View>
      </PreviewShell>
    )

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
          <View className="flex-1 justify-center items-center px-6">
            <AlertBox
              status="danger"
              title="Mystery Boxes"
              description="Failed to load: Network error"
            >
              <TactileButton
                animation="disable-all"
                variant="primary"
                onPress={() => {}}
                className="mt-4"
              >
                Retry
              </TactileButton>
            </AlertBox>
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

  if (key === 'vault:empty-nfts') {
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'surface', padTop: 'lg' })}>
          <View className="flex-1 justify-center items-center px-6">
            <AlertBox
              status="warning"
              title="No NFTs"
              description="You don't own any NFTs yet. Mint one to get started!"
            />
          </View>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'vault:empty-boxes') {
    const gl = gridLayout()
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'surface', padTop: 'lg' })}>
          <View className="w-full px-4 pt-4">
            <View className={gl.row()}>
              <View className={gl.item()}>
                <MysteryBoxCard
                  rarity="common"
                  box={null}
                  imageUrl="https://placehold.co/400x400/9CA3AF/white?text=Common%0ABox"
                  count={0}
                />
              </View>
              <View className={gl.item()}>
                <MysteryBoxCard
                  rarity="rare"
                  box={null}
                  imageUrl="https://placehold.co/400x400/3B82F6/white?text=Rare%0ABox"
                  count={0}
                />
              </View>
            </View>
            <View className={gl.row()}>
              <View className={gl.item()}>
                <MysteryBoxCard
                  rarity="legendary"
                  box={null}
                  imageUrl="https://placehold.co/400x400/F59E0B/white?text=Legendary%0ABox"
                  count={0}
                />
              </View>
              <View className={gl.item()}>
                <MysteryBoxCard
                  rarity="transcendent"
                  box={null}
                  imageUrl="https://placehold.co/400x400/EC4899/white?text=Trans%0ABox"
                  count={0}
                />
              </View>
            </View>
          </View>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'vault:nft-error')
    return (
      <PreviewShell onBack={dismiss}>
        <ScreenError title="Vault" message="Failed to load NFTs: network error" onRetry={dismiss} />
      </PreviewShell>
    )

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
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'surface', padTop: 'lg' })}>
          <View className="py-15 w-full px-5">
            <AlertBox
              status="warning"
              title="No active listings"
              description="You haven't listed any NFTs yet."
            />
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

  if (key === 'marketplace:coming-soon-dialog') {
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'surface' })}>
          <Dialog
            isOpen
            onOpenChange={(isOpen) => {
              if (!isOpen) dismiss()
            }}
          >
            <Dialog.Portal>
              <Dialog.Overlay />
              <Dialog.Content>
                <Dialog.Close />
                <View className={dialogBody()}>
                  <Dialog.Title>Coming Soon</Dialog.Title>
                  <Dialog.Description>
                    Buying from marketplace is not yet available.
                  </Dialog.Description>
                </View>
                <View className={dialogFooter()}>
                  <TactileButton
                    animation="disable-all"
                    variant="primary"
                    size="sm"
                    onPress={dismiss}
                  >
                    OK
                  </TactileButton>
                </View>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'marketplace:sell-card') {
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
                  <TactileButton variant="outline" size="sm" onPress={() => {}}>
                    Unlist
                  </TactileButton>
                </View>
              }
            />
          </View>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'marketplace:empty-buy') {
    return (
      <PreviewShell onBack={dismiss}>
        <View className={screenContainer({ bg: 'surface', padTop: 'lg' })}>
          <View className="py-15 w-full px-5">
            <AlertBox
              status="default"
              title="No listings"
              description="There are no NFTs listed on the marketplace right now."
            />
          </View>
        </View>
      </PreviewShell>
    )
  }

  if (key === 'marketplace:error')
    return (
      <PreviewShell onBack={dismiss}>
        <ScreenError
          title="Marketplace"
          message="Failed to load marketplace listings"
          onRetry={dismiss}
        />
      </PreviewShell>
    )

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
