import './global.css';
import { initialize } from '@embrace-io/react-native';
import { StatusBar } from 'expo-status-bar';
import { 
  View, 
  ActivityIndicator, 
  FlatList, 
  ViewToken,
  Dimensions,
} from 'react-native';

initialize();
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback, useRef } from 'react';
import { useAuth, useUserApproval } from '@/hooks';
import { Auth, PageIndicator, ProfileButton } from '@/components';
import { InviteCodeScreen, Profile } from '@/screens';
import { colors } from '@/constants';
import { PAGES, VIEWABILITY_CONFIG } from '@/constants/navigation';
import { appStyles as styles } from '@/styles';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { HeroUINativeProvider } from 'heroui-native';
import { GameConfigProvider } from '@/store/gameConfigStore';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider>
        <GameConfigProvider>
          <AppInner />
        </GameConfigProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}

function AppInner() {
  const { session, loading: authLoading, signOut } = useAuth();
  const { approved, loading: approvalLoading, refetch } = useUserApproval(session);
  const [currentPage, setCurrentPage] = useState(0);
  const [profileVisible, setProfileVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleApprovalSuccess = useCallback(async () => {
    // After successful code submission, refetch approval status
    await refetch();
  }, [refetch]);

  const handleSignOut = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const scrollToPage = useCallback((pageIndex: number) => {
    flatListRef.current?.scrollToIndex({ index: pageIndex, animated: true });
  }, []);

  const handleOpenProfile = useCallback(() => setProfileVisible(true), []);
  const handleCloseProfile = useCallback(() => setProfileVisible(false), []);

  const onViewableItemsChangedRef = useRef<(info: { viewableItems: ViewToken[] }) => void>(
    ({ viewableItems }) => {
      if (viewableItems.length > 0) {
        setCurrentPage(viewableItems[0].index || 0);
      }
    }
  );

  const renderPage = useCallback(({ item }: { item: typeof PAGES[0] }) => {
    const Component = item.component;
    return (
      <View style={styles.pageWrapper}>
        <Component />
      </View>
    );
  }, []);

  // Show loading while checking auth or approval status
  if (authLoading || (session && approvalLoading)) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaProvider>
    );
  }

  // No session - show auth screen
  if (!session) {
    return (
      <SafeAreaProvider>
        <Auth />
      </SafeAreaProvider>
    );
  }

  // Session exists but user not approved - show invite code screen (BLOCKING)
  // Anonymous users (dev/test mode) skip invite code
  if (approved !== true && !session.user.is_anonymous) {
    return (
      <SafeAreaProvider>
        <InviteCodeScreen 
          onApprovalSuccess={handleApprovalSuccess}
          onSignOut={handleSignOut}
        />
      </SafeAreaProvider>
    );
  }

  // Session exists and user is approved (or in Expo Go dev mode) - show main app
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
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
          style={styles.flatList}
        />

        <ProfileButton onPress={handleOpenProfile} />

        <PageIndicator 
          totalPages={PAGES.length} 
          currentPage={currentPage} 
          onPageChange={scrollToPage}
        />

        <Profile 
          visible={profileVisible}
          onClose={handleCloseProfile}
        />
        
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
