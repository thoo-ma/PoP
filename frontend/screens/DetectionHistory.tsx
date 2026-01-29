import { Text, View, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { Card, NavigationHint } from '../components';
import { colors } from '../constants';
import { fetchDetectionHistory } from '../lib';
import { formatConfidencePercentage } from '../utils';
import type { DetectionRecord } from '../types/audio';
import { styles } from '../styles/DetectionHistory.styles';

export default function DetectionHistory() {
  const [detections, setDetections] = useState<DetectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDetections = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchDetectionHistory(50);
      setDetections(data || []);
    } catch (err) {
      console.error('Failed to load detections:', err);
      setError(err instanceof Error ? err.message : 'Failed to load detections');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDetections();
  }, [loadDetections]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDetections();
  }, [loadDetections]);

  // Calculate summary statistics
  const totalDetections = detections.length;
  const successfulDetections = detections.filter(d => d.detected).length;
  const successRate = totalDetections > 0 
    ? Math.round((successfulDetections / totalDetections) * 100) 
    : 0;

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const renderDetection = ({ item }: { item: DetectionRecord }) => (
    <View style={styles.detectionCard}>
      <View style={styles.detectionHeader}>
        <Text style={styles.detectionIcon}>
          {item.detected ? '✅' : '❌'}
        </Text>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.detectionDate}>
            {formatDate(item.created_at)} at {formatTime(item.created_at)}
          </Text>
        </View>
      </View>
      
      <View style={styles.detectionDetails}>
        <View>
          <Text style={styles.detectionLabel}>Confidence</Text>
          <Text style={styles.detectionValue}>
            {formatConfidencePercentage(item.confidence)}
          </Text>
        </View>
        
        {item.duration_seconds !== null && (
          <View>
            <Text style={styles.detectionLabel}>Duration</Text>
            <Text style={styles.detectionValue}>
              {item.duration_seconds.toFixed(1)}s
            </Text>
          </View>
        )}
        
        {item.model_version && (
          <View>
            <Text style={styles.detectionLabel}>Model</Text>
            <Text style={styles.detectionValue}>
              {item.model_version}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Detection History</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.historyTitle} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detection History</Text>
      <Text style={styles.description}>
        Your toilet flush detection record
      </Text>

      {/* Summary Card */}
      {totalDetections > 0 && (
        <Card
          title="Total Detections"
          value={`${successfulDetections}/${totalDetections} (${successRate}%)`}
          titleColor={colors.historyCard}
          valueColor={colors.historyValue}
          style={styles.summaryCard}
        />
      )}

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {/* Detection List */}
      <View style={styles.listContainer}>
        {detections.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🚽</Text>
            <Text style={styles.emptyText}>No detections yet</Text>
            <Text style={styles.emptySubtext}>Go flush and record your first one!</Text>
          </View>
        ) : (
          <FlatList
            data={detections}
            renderItem={renderDetection}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            style={styles.list}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.historyTitle}
              />
            }
          />
        )}
      </View>
      
      <NavigationHint text="← Swipe to go back" />
    </View>
  );
}
