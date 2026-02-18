import { useMemo } from 'react';
import type { DetectionResult } from '../../types';

/**
 * Custom hook to determine button states for recording and analyzing audio
 * @param isRecording - Whether audio is currently being recorded
 * @param isAnalyzing - Whether audio is currently being analyzed
 * @param audioUri - URI of recorded audio (null if no recording exists)
 * @param detectionResult - Result of audio analysis (null if no result yet)
 * @returns Object with button state flags
 */
export const useRecordingButtonState = (
  isRecording: boolean,
  isAnalyzing: boolean,
  audioUri: string | null,
  detectionResult: DetectionResult | null
) => {
  return useMemo(() => ({
    canRecord: !isAnalyzing && !detectionResult,
    canAnalyze: audioUri && !isRecording && !isAnalyzing && !detectionResult,
    hasResult: !!detectionResult,
  }), [isRecording, isAnalyzing, audioUri, detectionResult]);
};
