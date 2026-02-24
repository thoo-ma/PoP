import { useState, useEffect, useCallback } from 'react';
import { fetchDetectionHistory } from '@/lib';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import type { DetectionRecord } from '@/types';

/**
 * Hook to fetch and manage the user's toilet flush detection history.
 */
export function useDetectionHistory(limit: number = 50) {
  const [detections, setDetections] = useState<DetectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { error, handleError, clearError } = useErrorHandler('DetectionHistory');

  const loadDetections = useCallback(async () => {
    try {
      clearError();
      const data = await fetchDetectionHistory(limit);
      setDetections(data || []);
    } catch (err) {
      handleError(err, 'Failed to load detections');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [limit]);

  useEffect(() => {
    loadDetections();
  }, [loadDetections]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDetections();
  }, [loadDetections]);

  return {
    detections,
    loading,
    refreshing,
    error,
    onRefresh,
    refetch: loadDetections,
  };
}
