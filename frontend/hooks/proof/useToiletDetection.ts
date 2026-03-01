import { useState, useCallback } from 'react';
import { Audio } from 'expo-av';
import { File } from 'expo-file-system';
import { detectToiletFlush } from '@/lib/toiletDetectionApi';
import type { UseToiletDetectionReturn, DetectionResult, RateLimitError } from '@/types/audio';
import { isRateLimitError } from '@/utils/errorHelpers';
import { useErrorHandler } from '@/hooks/useErrorHandler';

/**
 * Hook to record audio and submit it to the toilet-flush detection pipeline.
 *
 * Manages the full recording lifecycle: requesting microphone permission,
 * starting/stopping an `expo-av` recording session, handing the base-64
 * audio to `detectToiletFlush`, and surfacing the detection result or any
 * rate-limit / error state to the caller.
 *
 * @returns Recording controls, loading flags, the last `DetectionResult`,
 *   the last `RateLimitError`, and error state.
 */
export const useToiletDetection = (): UseToiletDetectionReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { error, handleError, clearError } = useErrorHandler('ToiletDetection');
  const [rateLimitError, setRateLimitError] = useState<RateLimitError | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const startRecording = useCallback(async () => {
    try {
      // Clear previous state
      clearError();
      setRateLimitError(null);
      setDetectionResult(null);
      setAudioUri(null);

      // Request permissions
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        if (permission.canAskAgain) {
          handleError(new Error('Microphone permission is required to record audio'), 'Microphone permission is required to record audio');
        } else {
          handleError(new Error('Microphone permission denied. Please enable it in your device Settings → Pop → Microphone'), 'Microphone permission denied. Please enable it in your device Settings → Pop → Microphone');
        }
        return;
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Create recording with high quality settings
      const { recording: newRecording } = await Audio.Recording.createAsync(
        {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
          android: {
            extension: '.m4a',
            outputFormat: Audio.AndroidOutputFormat.MPEG_4,
            audioEncoder: Audio.AndroidAudioEncoder.AAC,
            sampleRate: 44100,
            numberOfChannels: 1,
            bitRate: 128000,
          },
          ios: {
            extension: '.m4a',
            outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
            audioQuality: Audio.IOSAudioQuality.HIGH,
            sampleRate: 44100,
            numberOfChannels: 1,
            bitRate: 128000,
          },
          web: {
            mimeType: 'audio/webm',
            bitsPerSecond: 128000,
          },
        }
      );

      setRecording(newRecording);
      setIsRecording(true);
    } catch (err) {
      handleError(err, 'Failed to start recording');
    }
  }, [clearError, handleError]);

  const stopRecording = useCallback(async () => {
    try {
      if (!recording) {
        return;
      }

      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      
      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.getURI();
      setAudioUri(uri);
      setRecording(null);

      if (!uri) {
        handleError(new Error('Failed to save recording'), 'Failed to save recording');
      }
    } catch (err) {
      handleError(err, 'Failed to stop recording');
    }
  }, [recording, handleError]);

  const analyzeAudio = useCallback(async (threshold: number = 0.5) => {
    if (!audioUri) {
      handleError(new Error('No audio recording available'), 'No audio recording available');
      return;
    }

    try {
      setIsAnalyzing(true);
      clearError();
      setRateLimitError(null);
      setDetectionResult(null);

      // Read audio file as base64 using new File API
      const file = new File(audioUri);
      const base64Audio = await file.base64();

      // Call detection API
      const result = await detectToiletFlush(base64Audio, threshold);
      setDetectionResult(result);
    } catch (err) {
      // Check if it's a rate limit error
      if (isRateLimitError(err)) {
        setRateLimitError(err);
        handleError(new Error('Daily detection limit reached'), 'Daily detection limit reached');
      } else {
        handleError(err, 'Detection failed: Unknown error');
      }
    } finally {
      setIsAnalyzing(false);
    }
  }, [audioUri, clearError, handleError]);

  const clearResult = useCallback(() => {
    setDetectionResult(null);
    clearError();
    setRateLimitError(null);
    setAudioUri(null);
  }, [clearError]);

  return {
    isRecording,
    audioUri,
    detectionResult,
    isAnalyzing,
    error,
    rateLimitError,
    startRecording,
    stopRecording,
    analyzeAudio,
    clearResult,
  };
};
