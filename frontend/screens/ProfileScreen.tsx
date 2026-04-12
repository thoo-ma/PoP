import { MaterialIcons } from '@expo/vector-icons'
import { useScrollToTop } from '@react-navigation/native'
import { Avatar, Button, cn, Spinner } from 'heroui-native'
import { useRef, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useCSSVariable } from 'uniwind'
import { LootRouletteCard, MysteryBoxRevealModal, ScreenError, ScreenLoader } from '@/components'
import { useAuth, useProfileStats, useUserNFTs, useWallet } from '@/hooks'
import {
  bustMessage,
  profileModal,
  repairFullEnergy,
  repairSuccess,
  screenContainer,
  tactileButton,
  tactileButtonText,
  walletModal,
} from '@/styles'
import { useSignOutDialog } from '@/utils'
import ProfileModals from './ProfileModals'

type DevPreview =
  | 'error'
  | 'loader'
  | 'repair-success'
  | 'repair-full-energy'
  | 'repair-bust'
  | 'breed-bust'
  | 'loot-roulette'
  | 'mystery-box-reveal'
  | null

const MOCK_NFT = {
  id: 'mock-nft-1',
  name: 'toilet_mock_001',
  image_url: 'https://placehold.co/400x400/8B5CF6/white?text=NFT',
  rarity: 'rare' as const,
  type: 'turbo-flush' as const,
  level: 5,
  xp: 120,
  efficiency: 72,
  resilience: 68,
  comfort: 55,
  luck: 43,
  energy: 100,
  breed_count: 1,
  stat_points: 0,
  isListed: false,
  created_at: '2026-01-01T00:00:00Z',
  last_used_at: null,
  updated_at: '2026-01-01T00:00:00Z',
}

export default function ProfileScreen() {
  const { getUserDisplayName, user, signOut } = useAuth()
  const { detections, daysActive, loading: statsLoading } = useProfileStats()
  const { nfts } = useUserNFTs()
  const { poopBalance, loading: walletLoading } = useWallet()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [devPreview, setDevPreview] = useState<DevPreview>(null)
  const { dialog: signOutDialog, show: showSignOutDialog } = useSignOutDialog()
  const scrollRef = useRef<ScrollView>(null)
  useScrollToTop(scrollRef)

  const onSurface = useCSSVariable('--color-on-surface') as string

  const handleSignOut = () => {
    showSignOutDialog(async () => {
      setIsSigningOut(true)
      try {
        await signOut()
      } finally {
        setIsSigningOut(false)
      }
    })
  }

  const initials = getUserDisplayName()
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const p = profileModal()
  const w = walletModal()

  // ── DEV previews ──────────────────────────────────────────────────────────
  if (__DEV__ && devPreview) {
    const dismiss = () => setDevPreview(null)
    const bm = bustMessage()
    const rs = repairSuccess()
    const rfe = repairFullEnergy()
    if (devPreview === 'error')
      return (
        <ScreenError
          title="Vault"
          message="Failed to load NFTs: something went wrong"
          onRetry={dismiss}
        />
      )
    if (devPreview === 'loader')
      return (
        <View className="flex-1">
          <ScreenLoader title="Vault" message="Loading your collection..." />
          <View className="absolute bottom-32 left-6 right-6">
            <Button
              variant="ghost"
              feedbackVariant="none"
              onPress={dismiss}
              className={cn(tactileButton({ variant: 'default' }), 'w-full')}
            >
              <Button.Label className={tactileButtonText({ variant: 'default' })}>
                ← Back
              </Button.Label>
            </Button>
          </View>
        </View>
      )
    if (devPreview === 'repair-success')
      return (
        <View className="flex-1 bg-background items-center justify-center px-6 pb-32">
          <View className={rs.root()}>
            <Text className={rs.text()}>✓ Repair Complete!</Text>
            <Text className={rs.text()}>Energy: 100%</Text>
            <Text className={rs.text()}>-42 POOP spent</Text>
          </View>
          <Button
            variant="ghost"
            feedbackVariant="none"
            onPress={dismiss}
            className={cn(tactileButton({ variant: 'default' }), 'mt-6 w-full')}
          >
            <Button.Label className={tactileButtonText({ variant: 'default' })}>
              ← Back
            </Button.Label>
          </Button>
        </View>
      )
    if (devPreview === 'repair-full-energy')
      return (
        <View className="flex-1 bg-background items-center justify-center px-6 pb-32">
          <View className={rfe.root()}>
            <Text className={rfe.text()}>This NFT is already at full energy!</Text>
          </View>
          <Button
            variant="ghost"
            feedbackVariant="none"
            onPress={dismiss}
            className={cn(tactileButton({ variant: 'default' }), 'mt-6 w-full')}
          >
            <Button.Label className={tactileButtonText({ variant: 'default' })}>
              ← Back
            </Button.Label>
          </Button>
        </View>
      )
    if (devPreview === 'repair-bust' || devPreview === 'breed-bust')
      return (
        <View className="flex-1 bg-background items-center justify-center px-6 pb-32">
          <View className={bm.root()}>
            <Text className={bm.title()}>BUST</Text>
            <Text className={bm.detail()}>You lost 120 POOP — better luck next time!</Text>
          </View>
          <Button
            variant="ghost"
            feedbackVariant="none"
            onPress={dismiss}
            className={cn(tactileButton({ variant: 'default' }), 'mt-6 w-full')}
          >
            <Button.Label className={tactileButtonText({ variant: 'default' })}>
              ← Back
            </Button.Label>
          </Button>
        </View>
      )
    if (devPreview === 'loot-roulette')
      return (
        <View className="flex-1 bg-background items-center justify-center px-6 pb-32">
          <LootRouletteCard lootRollId="mock-loot-roll-id" onDone={dismiss} />
          <Button
            variant="ghost"
            feedbackVariant="none"
            onPress={dismiss}
            className={cn(tactileButton({ variant: 'default' }), 'mt-4 w-full')}
          >
            <Button.Label className={tactileButtonText({ variant: 'default' })}>
              ← Back
            </Button.Label>
          </Button>
        </View>
      )
    if (devPreview === 'mystery-box-reveal')
      return <MysteryBoxRevealModal visible nft={MOCK_NFT} onClose={dismiss} />
  }

  return (
    <View className={screenContainer({ bg: 'surface' })}>
      <View className="flex-1">
        <ScrollView
          ref={scrollRef}
          contentContainerClassName={p.scrollContainer()}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar */}
          <View className={p.avatarWrap()}>
            <Avatar size="lg" color="accent" alt={getUserDisplayName() || 'User avatar'}>
              <Avatar.Fallback>
                {initials || <MaterialIcons name="person" size={28} />}
              </Avatar.Fallback>
            </Avatar>
          </View>

          {/* User info */}
          <Text className={p.username()}>{getUserDisplayName()}</Text>
          {user?.email && <Text className={p.email()}>{user.email}</Text>}

          {/* Stats */}
          <View className={p.statsRow()}>
            <View className={p.statCol()}>
              {statsLoading ? (
                <Spinner size="sm" />
              ) : (
                <Text className={p.statValue()}>{detections}</Text>
              )}
              <Text className={p.statLabel()}>Detections</Text>
            </View>
            <View className={p.statDivider()} />
            <View className={p.statCol()}>
              <Text className={p.statValue()}>{nfts.length}</Text>
              <Text className={p.statLabel()}>NFTs</Text>
            </View>
            <View className={p.statDivider()} />
            <View className={p.statCol()}>
              {statsLoading ? (
                <Spinner size="sm" />
              ) : (
                <Text className={p.statValue()}>{daysActive}</Text>
              )}
              <Text className={p.statLabel()}>Days Active</Text>
            </View>
          </View>

          {/* POOP Balance */}
          <View className={w.balanceCard()}>
            <Text className={w.balanceLabel()}>POOP Balance</Text>
            {walletLoading ? (
              <Text className={w.balanceValue()}>—</Text>
            ) : (
              <Text className={w.balanceValue()}>
                {poopBalance ?? 0} <Text className={w.currencyLabel()}>POOP</Text>
              </Text>
            )}
          </View>

          {/* DEV preview menu */}
          {__DEV__ && (
            <View className="w-full gap-2 mb-2.5 mt-2">
              <Text className="text-xs font-black text-outline uppercase tracking-wider text-center mb-1">
                DEV Previews
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {(
                  [
                    ['error', 'ScreenError'],
                    ['loader', 'ScreenLoader'],
                    ['repair-success', 'Repair — Success'],
                    ['repair-full-energy', 'Repair — Full Energy'],
                    ['repair-bust', 'Repair — Bust'],
                    ['breed-bust', 'Breed — Bust'],
                    ['loot-roulette', 'Loot Roulette'],
                    ['mystery-box-reveal', 'Mystery Box Reveal'],
                  ] as [DevPreview, string][]
                ).map(([key, label]) => (
                  <Button
                    key={key}
                    variant="ghost"
                    feedbackVariant="none"
                    className={cn(
                      tactileButton({ variant: 'default', size: 'sm' }),
                      'flex-1 basis-[47%]',
                    )}
                    onPress={() => setDevPreview(key)}
                  >
                    <Button.Label className={tactileButtonText({ variant: 'default', size: 'sm' })}>
                      {label}
                    </Button.Label>
                  </Button>
                ))}
              </View>
            </View>
          )}
          <Button
            variant="ghost"
            feedbackVariant="none"
            className={cn(tactileButton({ variant: 'default' }), 'w-full mb-2.5')}
            onPress={handleSignOut}
            isDisabled={isSigningOut}
            accessibilityLabel="Sign out"
            accessibilityHint="Sign out of your account"
          >
            <MaterialIcons name="logout" size={18} color={onSurface} />
            <Button.Label className={tactileButtonText({ variant: 'default' })}>
              Sign Out
            </Button.Label>
          </Button>
        </ScrollView>
      </View>
      <ProfileModals signOutDialog={signOutDialog} />
    </View>
  )
}
