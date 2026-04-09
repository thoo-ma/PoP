import 'react-native-gesture-handler'
import './global.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { StatusBar } from 'expo-status-bar'
import * as Updates from 'expo-updates'
import { HeroUINativeProvider, Spinner } from 'heroui-native'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Dimensions, FlatList, View, type ViewToken } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import {
  Auth,
  ErrorBoundary,
  PageIndicator,
  ProfileButton,
  ScreenHeader,
  WalletButton,
} from '@/components'
import { PAGES, VIEWABILITY_CONFIG } from '@/constants/navigation'
import { useAuth, useUserApproval } from '@/hooks'
import { queryClient } from '@/lib/queryClient'
import { InviteCodeScreen, Profile, Wallet } from '@/screens'

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <HeroUINativeProvider>
          <QueryClientProvider client={queryClient}>
            <ErrorBoundary>
              <AppInner />
            </ErrorBoundary>
          </QueryClientProvider>
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

  // DEBUG: remove after confirming OTA works end-to-end
  useEffect(() => {
    async function applyUpdate() {
      try {
        const updateId = Updates.updateId ?? 'embedded'
        const channel = Updates.channel ?? 'unknown'
        const runtimeVersion = Updates.runtimeVersion ?? 'unknown'
        const isEmbedded = Updates.isEmbeddedLaunch

        const check = await Updates.checkForUpdateAsync()
        Alert.alert(
          'OTA Debug',
          `Current: ${updateId}\nChannel: ${channel}\nRuntime: ${runtimeVersion}\nEmbedded: ${isEmbedded}\nUpdate available: ${check.isAvailable}`,
        )

        if (check.isAvailable) {
          const result = await Updates.fetchUpdateAsync()
          Alert.alert('OTA Downloaded', `Manifest ID: ${result.manifest?.id}\nReloading now...`, [
            {
              text: 'OK',
              onPress: async () => {
                try {
                  await Updates.reloadAsync()
                } catch (reloadError) {
                  Alert.alert('OTA Error', String(reloadError))
                }
              },
            },
          ])
        }
      } catch (e) {
        Alert.alert('OTA Error', String(e))
      }
    }
    applyUpdate()
  }, [])

  const handleApprovalSuccess = useCallback(async () => {
    // After successful code submission, refetch approval status
    await refetch()
  }, [refetch])

  const handleSignOut = useCallback(async () => {
    queryClient.clear()
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
        <ErrorBoundary>
          <Component />
        </ErrorBoundary>
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
    return (
      <ErrorBoundary>
        <Auth />
      </ErrorBoundary>
    )
  }

  // Session exists but user not approved - show invite code screen (BLOCKING)
  // Anonymous users (dev/test mode) skip invite code
  if (approved !== true && !session.user.is_anonymous) {
    return (
      <ErrorBoundary>
        <InviteCodeScreen onApprovalSuccess={handleApprovalSuccess} onSignOut={handleSignOut} />
      </ErrorBoundary>
    )
  }

  // Session exists and user is approved (or in Expo Go dev mode) - show main app
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
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
