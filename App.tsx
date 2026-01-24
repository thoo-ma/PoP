import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  View, 
  ActivityIndicator, 
  FlatList, 
  ViewToken,
  SafeAreaView
} from 'react-native';
import { useState, useCallback } from 'react';
import { useAuth } from './hooks/useAuth';
import Auth from './components/Auth';
import { PAGES, VIEWABILITY_CONFIG } from './constants/navigation';
import { styles, width } from './styles/App.styles';

export default function App() {
  const { session, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState(0);

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentPage(viewableItems[0].index || 0);
    }
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

  const renderPage = ({ item }: { item: typeof PAGES[0] }) => {
    const Component = item.component;
    return (
      <View style={styles.pageWrapper}>
        <Component />
      </View>
    );
  };

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

      {/* Page indicators */}
      <View style={styles.pagination}>
        {Array.from({ length: PAGES.length }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentPage === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
      
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
