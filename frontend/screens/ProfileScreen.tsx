import { MaterialIcons } from '@expo/vector-icons'
import { useScrollToTop } from '@react-navigation/native'
import type { ReactElement } from 'react'
import { useRef, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useCSSVariable } from 'uniwind'
import { ScreenError } from '@/components'
import type DevCatalogCmp from '@/components/dev/DevCatalog'
import type renderDevPreviewFn from '@/components/dev/DevPreviewRenderer'
import { Avatar, Button, Card, Skeleton } from '@/components/ui'
import { useAuth, useProfileStats, useSignOutDialog, useUserNFTs, useWallet } from '@/hooks'

// Lazy dev-only requires — Metro dead-strips these from production bundles
// because __DEV__ is replaced with `false` at build time.
const DevCatalog = __DEV__
  ? (require('@/components/dev/DevCatalog') as { default: typeof DevCatalogCmp }).default
  : null
const renderDevPreview = __DEV__
  ? (require('@/components/dev/DevPreviewRenderer') as { default: typeof renderDevPreviewFn })
      .default
  : null

import { profileModal, screenContainer, walletModal } from '@/styles'
import ProfileModals from './ProfileModals'

export default function ProfileScreen() {
  const { getUserDisplayName, user, signOut } = useAuth()
  const {
    detections,
    daysActive,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useProfileStats()
  const { nfts, error: nftsError, refetch: refetchNfts } = useUserNFTs()
  const {
    poopBalance,
    loading: walletLoading,
    error: walletError,
    refetch: refetchWallet,
  } = useWallet()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [activePreview, setActivePreview] = useState<string | null>(null)
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null)
  const { dialog: signOutDialog, show: showSignOutDialog } = useSignOutDialog()
  const scrollRef = useRef<ScrollView>(null)
  const savedScrollY = useRef<number>(0)
  useScrollToTop(scrollRef)

  const onSurface = useCSSVariable('--foreground') as string

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

  const profileError = statsError || nftsError || walletError

  if (__DEV__ && activePreview && renderDevPreview) {
    return renderDevPreview(activePreview, () => {
      setActivePreview(null)
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ y: savedScrollY.current, animated: false })
      })
    }) as unknown as ReactElement
  }

  if (profileError) {
    return (
      <ScreenError
        title="Profile"
        message={`Failed to load profile: ${profileError}`}
        onRetry={() => {
          refetchStats()
          refetchNfts()
          refetchWallet()
        }}
      />
    )
  }

  return (
    <View className={screenContainer({ bg: 'surface' })}>
      <View className="flex-1 w-full">
        <ScrollView
          ref={scrollRef}
          contentContainerClassName={p.scrollContainer()}
          showsVerticalScrollIndicator={false}
          onScroll={(e) => {
            savedScrollY.current = e.nativeEvent.contentOffset.y
          }}
          scrollEventThrottle={16}
        >
          {/* Avatar */}
          <View className={`${p.avatarWrap()} border-border`}>
            <Avatar size="lg" alt={getUserDisplayName() || 'User avatar'}>
              <Avatar.Fallback>
                {initials || <MaterialIcons name="person" size={28} />}
              </Avatar.Fallback>
            </Avatar>
          </View>

          {/* User info */}
          <Text className={`${p.username()} text-foreground`}>{getUserDisplayName()}</Text>
          {user?.email && <Text className={`${p.email()} text-muted`}>{user.email}</Text>}

          {/* Stats */}
          <Card className={`${p.statsRow()} bg-surface-secondary`}>
            <View className={p.statCol()}>
              <Skeleton isLoading={statsLoading} className="h-6 w-12 rounded-tag">
                <Text className={`${p.statValue()} text-foreground`}>{detections}</Text>
              </Skeleton>
              <Text className={`${p.statLabel()} text-muted`}>Detections</Text>
            </View>
            <View className="w-px h-8 bg-border" />
            <View className={p.statCol()}>
              <Text className={`${p.statValue()} text-foreground`}>{nfts.length}</Text>
              <Text className={`${p.statLabel()} text-muted`}>NFTs</Text>
            </View>
            <View className="w-px h-8 bg-border" />
            <View className={p.statCol()}>
              <Skeleton isLoading={statsLoading} className="h-6 w-12 rounded-tag">
                <Text className={`${p.statValue()} text-foreground`}>{daysActive}</Text>
              </Skeleton>
              <Text className={`${p.statLabel()} text-muted`}>Days Active</Text>
            </View>
          </Card>

          {/* POOP Balance */}
          <Card className={`${w.balanceCard()} bg-surface-secondary`}>
            <Text className={`${w.balanceLabel()} text-muted`}>POOP Balance</Text>
            {walletLoading ? (
              <Text className={`${w.balanceValue()} text-foreground`}>—</Text>
            ) : (
              <Text className={`${w.balanceValue()} text-foreground`}>
                {poopBalance ?? 0} <Text className={`${w.currencyLabel()} text-muted`}>POOP</Text>
              </Text>
            )}
          </Card>

          {/* DEV catalog */}
          {__DEV__ && DevCatalog && (
            <DevCatalog
              onSelect={(key, sectionIndex) => {
                setActiveSectionIndex(sectionIndex)
                setActivePreview(key)
              }}
              initialExpandedSections={
                activeSectionIndex !== null ? new Set([activeSectionIndex]) : new Set()
              }
            />
          )}
          {/* half-step mb-2.5: tighter than the section gap above to group the action with the section. */}
          <Button
            variant="primary"
            className="w-full mb-2.5"
            onPress={handleSignOut}
            isDisabled={isSigningOut}
            accessibilityLabel="Sign out"
            accessibilityHint="Sign out of your account"
          >
            <MaterialIcons name="logout" size={18} color={onSurface} />
            <Button.Label>Sign Out</Button.Label>
          </Button>
        </ScrollView>
      </View>
      <ProfileModals signOutDialog={signOutDialog} />
    </View>
  )
}
