import { Text, View, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { useCallback } from 'react';
import { Card } from '../../components';
import { colors } from '../../constants';
import { formatConfidencePercentage } from '../../utils';
import { useDetectionHistory } from '../../hooks';
import type { DetectionRecord } from '../../types/audio';
import { styles } from '../../styles/proof/DetectionHistory.styles';

function formatDetectionDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDetectionTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function DetectionHistory() {
  const { detections, loading, refreshing, error, onRefresh } = useDetectionHistory();

  // Calculate summary statistics
  const totalDetections = detections.length;
  const successfulDetections = detections.filter(d => d.detected).length;
  const successRate = totalDetections > 0
    ? Math.round((successfulDetections / totalDetections) * 100)
    : 0;

  const renderDetection = useCallback(({ item }: { item: DetectionRecord }) => (
    <View style={styles.detectionCard}>
      <View style={styles.detectionHeader}>
        <Text style={styles.detectionIcon}>
          {item.detected ? '✅' : '❌'}
        </Text>
        <View style={styles.detectionDateContainer}>
          <Text style={styles.detectionDate}>
            {formatDetectionDate(item.created_at)} at {formatDetectionTime(item.created_at)}
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
  ), []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Detection History</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.title} />
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
          titleColor={colors.buttonPrimary}
          valueColor={colors.title}
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
                tintColor={colors.title}
              />
            }
          />
        )}
      </View>
    </View>
  );
}
