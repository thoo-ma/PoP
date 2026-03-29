import 'react-native-gesture-handler'
import './global.css'
import { StatusBar } from 'expo-status-bar'
import { View, FlatList, ViewToken, Dimensions } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { useState, useCallback, useRef } from 'react'
import { useAuth, useUserApproval } from '@/hooks'
import { Auth, PageIndicator, ProfileButton, WalletButton, ScreenHeader } from '@/components'
import { InviteCodeScreen, Profile, Wallet } from '@/screens'
import { PAGES, VIEWABILITY_CONFIG } from '@/constants/navigation'
import { colors } from '@/constants'

import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { HeroUINativeProvider, Spinner } from 'heroui-native'
import { GameConfigProvider } from '@/store/gameConfigStore'

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <HeroUINativeProvider>
          <GameConfigProvider>
            <AppInner />
          </GameConfigProvider>
        </HeroUINativeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

function AppInner() {
  const { session, loading: authLoading, signOut } = useAuth()
  const { approved, loading: approvalLoading, refetch } = useUserApproval(session)
  const [currentPage, setCurrentPage] = useState(0)
  const [profileVisible, setProfileVisible] = useState(false)
  const [walletVisible, setWalletVisible] = useState(false)
  const flatListRef = useRef<FlatList>(null)

  const handleApprovalSuccess = useCallback(async () => {
    // After successful code submission, refetch approval status
    await refetch()
  }, [refetch])

  const handleSignOut = useCallback(async () => {
    await signOut()
  }, [signOut])

  const scrollToPage = useCallback((pageIndex: number) => {
    flatListRef.current?.scrollToIndex({ index: pageIndex, animated: true })
  }, [])

  const handleOpenProfile = useCallback(() => setProfileVisible(true), [])
  const handleCloseProfile = useCallback(() => setProfileVisible(false), [])
  const handleOpenWallet = useCallback(() => setWalletVisible(true), [])
  const handleCloseWallet = useCallback(() => setWalletVisible(false), [])

  const onViewableItemsChangedRef = useRef<(info: { viewableItems: ViewToken[] }) => void>(
    ({ viewableItems }) => {
      if (viewableItems.length > 0) {
        setCurrentPage(viewableItems[0].index || 0)
      }
    },
  )

  const renderPage = useCallback(({ item }: { item: (typeof PAGES)[0] }) => {
    const Component = item.component
    return (
      <View style={{ width: Dimensions.get('window').width, height: '100%' }}>
        <Component />
      </View>
    )
  }, [])

  // Show loading while checking auth or approval status
  if (authLoading || (session && approvalLoading)) {
    return (
      <View className="flex-1 bg-surface-bg items-center justify-center">
        <Spinner size="lg" />
      </View>
    )
  }

  // No session - show auth screen
  if (!session) {
    return <Auth />
  }

  // Session exists but user not approved - show invite code screen (BLOCKING)
  // Anonymous users (dev/test mode) skip invite code
  if (approved !== true && !session.user.is_anonymous) {
    return <InviteCodeScreen onApprovalSuccess={handleApprovalSuccess} onSignOut={handleSignOut} />
  }

  // Session exists and user is approved (or in Expo Go dev mode) - show main app
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        ref={flatListRef}
        data={PAGES}
        renderItem={renderPage}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, index) => ({
          length: Dimensions.get('window').width,
          offset: Dimensions.get('window').width * index,
          index,
        })}
        onViewableItemsChanged={onViewableItemsChangedRef.current}
        viewabilityConfig={VIEWABILITY_CONFIG}
        bounces={false}
        windowSize={1}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        style={{ flex: 1 }}
      />

      <ProfileButton onPress={handleOpenProfile} />
      <ScreenHeader title={PAGES[currentPage]?.title ?? ''} />
      <WalletButton onPress={handleOpenWallet} />

      <PageIndicator
        totalPages={PAGES.length}
        currentPage={currentPage}
        onPageChange={scrollToPage}
      />

      <Profile visible={profileVisible} onClose={handleCloseProfile} />

      <Wallet visible={walletVisible} onClose={handleCloseWallet} />

      <StatusBar style="auto" />
    </SafeAreaView>
  )
}
