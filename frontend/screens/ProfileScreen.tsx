import { MaterialIcons } from '@expo/vector-icons'
import { useScrollToTop } from '@react-navigation/native'
import { Avatar, Button, cn, Spinner } from 'heroui-native'
import type { ReactElement } from 'react'
import { useRef, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useCSSVariable } from 'uniwind'
import type DevCatalogCmp from '@/components/dev/DevCatalog'
import type renderDevPreviewFn from '@/components/dev/DevPreviewRenderer'
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

import {
  profileModal,
  screenContainer,
  tactileButton,
  tactileButtonText,
  walletModal,
} from '@/styles'
import ProfileModals from './ProfileModals'

export default function ProfileScreen() {
  const { getUserDisplayName, user, signOut } = useAuth()
  const { detections, daysActive, loading: statsLoading } = useProfileStats()
  const { nfts } = useUserNFTs()
  const { poopBalance, loading: walletLoading } = useWallet()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [activePreview, setActivePreview] = useState<string | null>(null)
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null)
  const { dialog: signOutDialog, show: showSignOutDialog } = useSignOutDialog()
  const scrollRef = useRef<ScrollView>(null)
  const savedScrollY = useRef<number>(0)
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

  if (__DEV__ && activePreview && renderDevPreview) {
    return renderDevPreview(activePreview, () => {
      setActivePreview(null)
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ y: savedScrollY.current, animated: false })
      })
    }) as unknown as ReactElement
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
          <Button
            variant="ghost"
            feedbackVariant="none"
            className={cn(tactileButton({ variant: 'primary' }), 'w-full mb-2.5')}
            onPress={handleSignOut}
            isDisabled={isSigningOut}
            accessibilityLabel="Sign out"
            accessibilityHint="Sign out of your account"
          >
            <MaterialIcons name="logout" size={18} color={onSurface} />
            <Button.Label className={tactileButtonText({ variant: 'primary' })}>
              Sign Out
            </Button.Label>
          </Button>
        </ScrollView>
      </View>
      <ProfileModals signOutDialog={signOutDialog} />
    </View>
  )
}
