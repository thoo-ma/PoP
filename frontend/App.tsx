import 'react-native-gesture-handler'
import './global.css'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { QueryClientProvider } from '@tanstack/react-query'
import { StatusBar } from 'expo-status-bar'
import { HeroUINativeProvider } from 'heroui-native'
import { useCallback } from 'react'
import { View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Uniwind } from 'uniwind'
import { Auth, ErrorBoundary, PageIndicator } from '@/components'
import { Spinner } from '@/components/ui'

// Lock to light until Digital Atelier dark palette is designed; prevents
// HeroUI's bundled @variant dark palette from winning on a system-dark device.
Uniwind.setTheme('light')

import { useAuth, useUserApproval } from '@/hooks'
import { queryClient } from '@/lib/queryClient'
import { InviteCodeScreen, ProfileScreen } from '@/screens'
import { Breed, Poop, Repair, Vault } from '@/screens/nft'
import type { RootTabParamList } from '@/types'

const Tab = createMaterialTopTabNavigator<RootTabParamList>()

export default function App() {
  return (
    <GestureHandlerRootView className="flex-1">
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
  const handleApprovalSuccess = useCallback(async () => {
    await refetch()
  }, [refetch])

  const handleSignOut = useCallback(async () => {
    queryClient.clear()
    await signOut()
  }, [signOut])

  // Show loading while checking auth or approval status
  if (authLoading || (session && approvalLoading)) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
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
    <View className="flex-1 bg-background">
      <NavigationContainer>
        <Tab.Navigator
          tabBarPosition="bottom"
          tabBar={(props) => <PageIndicator {...props} />}
          screenOptions={{
            swipeEnabled: true,
            animationEnabled: true,
          }}
        >
          <Tab.Screen name="Poop" component={Poop} />
          <Tab.Screen name="Vault" component={Vault} />
          <Tab.Screen name="Breed" component={Breed} />
          <Tab.Screen name="Repair" component={Repair} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </View>
  )
}
