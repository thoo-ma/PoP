import { StatusBar } from 'expo-status-bar';
import { 
  View, 
  ActivityIndicator, 
  FlatList, 
  ViewToken,
  SafeAreaView
} from 'react-native';
import { useState, useCallback } from 'react';
import { useAuth } from './hooks';
import { Auth, PageIndicator } from './components';
import { PAGES, VIEWABILITY_CONFIG } from './constants';
import { appStyles as styles, width } from './styles';

export default function App() {
  const { session, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState(0);

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
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

      <PageIndicator totalPages={PAGES.length} currentPage={currentPage} />
      
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
