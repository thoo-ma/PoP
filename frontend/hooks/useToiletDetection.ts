import { useState, useCallback } from 'react';
import { Audio } from 'expo-av';
import { File } from 'expo-file-system';
import { detectToiletFlush } from '../lib/toiletDetectionApi';
import type { UseToiletDetectionReturn, DetectionResult, RateLimitError } from '../types/audio';

export const useToiletDetection = (): UseToiletDetectionReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitError, setRateLimitError] = useState<RateLimitError | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const startRecording = useCallback(async () => {
    try {
      // Clear previous state
      setError(null);
      setRateLimitError(null);
      setDetectionResult(null);
      setAudioUri(null);

      // Request permissions
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        if (permission.canAskAgain) {
          setError('Microphone permission is required to record audio');
        } else {
          setError('Microphone permission denied. Please enable it in your device Settings → Pop → Microphone');
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
      setError(err instanceof Error ? err.message : 'Failed to start recording');
    }
  }, []);

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
        setError('Failed to save recording');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop recording');
    }
  }, [recording]);

  const analyzeAudio = useCallback(async (threshold: number = 0.5) => {
    if (!audioUri) {
      setError('No audio recording available');
      return;
    }

    try {
      setIsAnalyzing(true);
      setError(null);
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
      if (err && typeof err === 'object' && 'error' in err && err.error === 'rate_limit') {
        setRateLimitError(err as RateLimitError);
        setError('Daily detection limit reached');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Detection failed: Unknown error';
        setError(errorMessage);
      }
    } finally {
      setIsAnalyzing(false);
    }
  }, [audioUri]);

  const clearResult = useCallback(() => {
    setDetectionResult(null);
    setError(null);
    setRateLimitError(null);
    setAudioUri(null);
  }, []);

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
