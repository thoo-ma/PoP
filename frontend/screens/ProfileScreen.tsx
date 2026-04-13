import { MaterialIcons } from '@expo/vector-icons'
import { useScrollToTop } from '@react-navigation/native'
import { Avatar, Button, cn, Spinner } from 'heroui-native'
import { useRef, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useCSSVariable } from 'uniwind'
import { DevCatalog } from '@/components/dev'
import { useAuth, useProfileStats, useUserNFTs, useWallet } from '@/hooks'
import {
  profileModal,
  screenContainer,
  tactileButton,
  tactileButtonText,
  walletModal,
} from '@/styles'
import { useSignOutDialog } from '@/utils'
import ProfileModals from './ProfileModals'

export default function ProfileScreen() {
  const { getUserDisplayName, user, signOut } = useAuth()
  const { detections, daysActive, loading: statsLoading } = useProfileStats()
  const { nfts } = useUserNFTs()
  const { poopBalance, loading: walletLoading } = useWallet()
  const [isSigningOut, setIsSigningOut] = useState(false)
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

          {/* DEV catalog */}
          {__DEV__ && <DevCatalog />}
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
