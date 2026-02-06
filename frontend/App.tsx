import { StatusBar } from 'expo-status-bar';
import { 
  View, 
  ActivityIndicator, 
  FlatList, 
  ViewToken
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback, useRef } from 'react';
import { useAuth, useUserApproval } from './hooks';
import { Auth, PageIndicator } from './components';
import { InviteCodeScreen } from './screens';
import { PAGES, VIEWABILITY_CONFIG } from './config/navigation';
import { appStyles as styles, width } from './styles';
import { isExpoGo } from './lib/supabase';

export default function App() {
  const { session, loading: authLoading, signOut } = useAuth();
  const { approved, loading: approvalLoading, refetch } = useUserApproval();
  const [currentPage, setCurrentPage] = useState(0);
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

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentPage(viewableItems[0].index || 0);
    }
  }, []);

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
          <ActivityIndicator size="large" color="#000" />
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
  // Skip invite code check in Expo Go (dev mode)
  if (approved === false && !isExpoGo) {
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
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={VIEWABILITY_CONFIG}
          bounces={false}
          style={styles.flatList}
        />

        <PageIndicator 
          totalPages={PAGES.length} 
          currentPage={currentPage} 
          onPageChange={scrollToPage}
        />
        
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
