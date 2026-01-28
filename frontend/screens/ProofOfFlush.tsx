import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { Card, DifficultySelector } from '../components';
import { colors } from '../constants';
import { useToiletDetection } from '../hooks';
import type { DifficultyMode } from '../types';
import { styles } from '../styles/ProofOfFlush.styles';

export default function ProofOfFlush() {
  const [mode, setMode] = useState<DifficultyMode>('normal');
  
  const {
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
  } = useToiletDetection();

  // Map difficulty mode to threshold
  const getThreshold = (): number => {
    switch (mode) {
      case 'easy':
        return 0.3;
      case 'normal':
        return 0.5;
      case 'strict':
        return 0.7;
    }
  };

  // Cycle through difficulty modes
  const cycleDifficulty = () => {
    if (isRecording || isAnalyzing) return;
    
    if (mode === 'easy') {
      setMode('normal');
    } else if (mode === 'normal') {
      setMode('strict');
    } else {
      setMode('easy');
    }
    
    // Clear previous result when changing difficulty
    if (detectionResult) {
      clearResult();
    }
  };

  const handleRecordPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleAnalyzePress = () => {
    const threshold = getThreshold();
    analyzeAudio(threshold);
  };

  // Determine button states
  const canRecord = !isAnalyzing && !detectionResult;
  const canAnalyze = audioUri && !isRecording && !isAnalyzing && !detectionResult;
  const hasResult = !!detectionResult;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Proof of Flush 🚽</Text>
      <Text style={styles.description}>
        Record toilet flush sound{'\n'}
        for verification
      </Text>
      
      <DifficultySelector 
        mode={mode} 
        onModeChange={cycleDifficulty}
        disabled={isRecording || isAnalyzing}
      />

      {/* Recording Status Card */}
      {isRecording && (
        <Card
          title="Status"
          value="🎤 Recording..."
          titleColor={colors.poopCard}
          valueColor="#dc2626"
          style={styles.card}
        />
      )}

      {/* Analyzing Status Card */}
      {isAnalyzing && (
        <Card
          title="Status"
          value="🔍 Analyzing..."
          titleColor={colors.poopCard}
          valueColor={colors.poopValue}
          style={styles.card}
        />
      )}

      {/* Detection Result Card */}
      {hasResult && (
        <>
          <Card
            title="Detection"
            value={detectionResult.detected ? '✅ Toilet Flush Detected!' : '❌ Not Detected'}
            titleColor={colors.poopCard}
            valueColor={detectionResult.detected ? '#4ade80' : '#dc2626'}
            style={styles.card}
          />
          <Card
            title="Confidence"
            value={`${Math.round(detectionResult.confidence * 100)}%`}
            titleColor={colors.poopCard}
            valueColor={colors.poopValue}
            style={styles.card}
          />
          <Card
            title="Duration"
            value={`${detectionResult.duration_seconds.toFixed(1)}s`}
            titleColor={colors.poopCard}
            valueColor={colors.poopValue}
            style={styles.card}
          />
        </>
      )}

      {/* Error Messages */}
      {rateLimitError && (
        <Text style={styles.rateLimitText}>
          {rateLimitError.message}
        </Text>
      )}
      
      {error && !rateLimitError && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            isRecording && styles.buttonRecording,
            !canRecord && styles.buttonDisabled,
          ]}
          onPress={handleRecordPress}
          disabled={!canRecord}
        >
          <Text style={styles.buttonText}>
            {isRecording ? 'Stop' : 'Record'}
          </Text>
        </TouchableOpacity>

        {audioUri && !hasResult && (
          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonAnalyze,
              !canAnalyze && styles.buttonDisabled,
            ]}
            onPress={handleAnalyzePress}
            disabled={!canAnalyze}
          >
            {isAnalyzing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Analyze</Text>
            )}
          </TouchableOpacity>
        )}

        {hasResult && (
          <TouchableOpacity
            style={styles.button}
            onPress={clearResult}
          >
            <Text style={styles.buttonText}>New Test</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={styles.hint}>← Swipe to navigate →</Text>
    </View>
  );
}
