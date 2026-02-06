import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, DifficultySelector, NavigationHint } from '../components';
import { colors } from '../constants';
import { useToiletDetection, useDifficultyCycle, useRecordingButtonState } from '../hooks';
import { getThresholdForDifficulty, formatConfidencePercentage } from '../utils';
import { styles } from '../styles/ProofOfFlush.styles';

export default function ProofOfFlush() {
  const { mode, cycleMode } = useDifficultyCycle('normal');
  
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

  // Cycle through difficulty modes only when not recording/analyzing
  const handleCycleMode = () => {
    if (isRecording || isAnalyzing) return;
    
    cycleMode();
    
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
    const threshold = getThresholdForDifficulty(mode);
    analyzeAudio(threshold);
  };

  // Determine button states
  const { canRecord, canAnalyze, hasResult } = useRecordingButtonState(
    isRecording,
    isAnalyzing,
    audioUri,
    detectionResult
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Proof of Flush 🚽</Text>
      <Text style={styles.description}>
        Record toilet flush sound{'\n'}
        for verification
      </Text>
      
      <DifficultySelector 
        mode={mode} 
        onModeChange={handleCycleMode}
        disabled={isRecording || isAnalyzing}
      />

      {/* Recording Status Card */}
      {isRecording && (
        <Card
          title="Status"
          value="🎤 Recording..."
          titleColor={colors.card}
          valueColor="#dc2626"
          style={styles.card}
        />
      )}

      {/* Analyzing Status Card */}
      {isAnalyzing && (
        <Card
          title="Status"
          value="🔍 Analyzing..."
          titleColor={colors.card}
          valueColor={colors.value}
          style={styles.card}
        />
      )}

      {/* Detection Result Card */}
      {detectionResult && (
        <>
          <Card
            title="Detection"
            value={detectionResult.detected ? '✅ Toilet Flush Detected!' : '❌ Not Detected'}
            titleColor={colors.card}
            valueColor={detectionResult.detected ? '#4ade80' : '#dc2626'}
            style={styles.card}
          />
          <Card
            title="Confidence"
            value={formatConfidencePercentage(detectionResult.confidence)}
            titleColor={colors.card}
            valueColor={colors.value}
            style={styles.card}
          />
          <Card
            title="Duration"
            value={`${detectionResult.duration_seconds.toFixed(1)}s`}
            titleColor={colors.card}
            valueColor={colors.value}
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
