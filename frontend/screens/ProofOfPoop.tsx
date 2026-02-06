import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { Card, DifficultySelector, NavigationHint } from '../components';
import { colors } from '../constants';
import { useImmobilityChallenge, useToiletDetection, useDifficultyCycle, useRecordingButtonState } from '../hooks';
import type { ChallengePhase, TimelapseOption } from '../types';
import { formatTime, getThresholdForDifficulty, formatConfidencePercentage } from '../utils';
import { styles } from '../styles/ProofOfPoop.styles';

export default function ProofOfPoop() {
  const [phase, setPhase] = useState<ChallengePhase>('setup');
  const { mode: poopDifficulty, cycleMode: cyclePoopMode } = useDifficultyCycle('normal');
  const { mode: immobilityDifficulty, cycleMode: cycleImmobilityMode } = useDifficultyCycle('normal');
  const [timelapseOption, setTimelapseOption] = useState<TimelapseOption>(10000);
  const [immobilityAchieved, setImmobilityAchieved] = useState<boolean>(false);
  const [finalImmobilityTime, setFinalImmobilityTime] = useState<number>(0);
  const [frozenRemainingTime, setFrozenRemainingTime] = useState<number | null>(null);

  const { elapsedTime, status, isRunning, startChallenge, stopChallenge } = 
    useImmobilityChallenge(immobilityDifficulty);

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

  // Cycle through difficulty modes only in setup phase
  const handleCyclePoopDifficulty = () => {
    if (phase !== 'setup') return;
    cyclePoopMode();
  };

  const handleCycleImmobilityDifficulty = () => {
    if (phase !== 'setup') return;
    cycleImmobilityMode();
  };

  // Monitor immobility phase
  useEffect(() => {
    if (phase !== 'immobility') return;

    // Freeze the timer when movement is detected
    if (status === 'warning' && frozenRemainingTime === null) {
      const currentRemaining = Math.max(0, timelapseOption - elapsedTime);
      setFrozenRemainingTime(currentRemaining);
    }

    // Unfreeze the timer when back to running
    if (status === 'running' && frozenRemainingTime !== null) {
      setFrozenRemainingTime(null);
    }

    // Check if time limit reached and still running
    if (elapsedTime >= timelapseOption && status === 'running') {
      // Successfully completed immobility phase
      stopChallenge();
      setImmobilityAchieved(true);
      setFinalImmobilityTime(elapsedTime);
      setPhase('prompt');
    }
  }, [phase, elapsedTime, status, isRunning, timelapseOption, frozenRemainingTime]);

  // Start the ultimate challenge
  const handleStartChallenge = () => {
    setPhase('immobility');
    setImmobilityAchieved(false);
    setFinalImmobilityTime(0);
    setFrozenRemainingTime(null);
    startChallenge();
  };

  // Stop immobility challenge manually
  const handleStopImmobility = () => {
    stopChallenge();
    setImmobilityAchieved(false);
    setFinalImmobilityTime(elapsedTime);
    setFrozenRemainingTime(null);
    setPhase('setup');
  };

  // Move to recording phase
  const handleStartRecording = () => {
    setPhase('recording');
  };

  // Handle recording button
  const handleRecordPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Handle analyze button
  const handleAnalyzePress = () => {
    const threshold = getThresholdForDifficulty(poopDifficulty);
    analyzeAudio(threshold);
  };

  // Reset everything for new challenge
  const handleNewChallenge = () => {
    clearResult();
    setPhase('setup');
    setImmobilityAchieved(false);
    setFinalImmobilityTime(0);
  };

  // Calculate remaining time during immobility phase
  const remainingTime = frozenRemainingTime !== null 
    ? frozenRemainingTime 
    : Math.max(0, timelapseOption - elapsedTime);

  // Render based on phase
  const renderSetupPhase = () => (
    <>
      <Text style={styles.title}>Proof of Poop 💩</Text>
      <Text style={styles.description}>
        Stay immobile, then prove your poop{'\n'}
        The ultimate challenge awaits
      </Text>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Immobility Duration</Text>
        <View style={styles.timelapseContainer}>
          <TouchableOpacity
            style={[
              styles.timelapseButton,
              timelapseOption === 5000 && styles.timelapseButtonActive,
            ]}
            onPress={() => setTimelapseOption(5000)}
          >
            <Text style={[
              styles.timelapseText,
              timelapseOption === 5000 && styles.timelapseTextActive,
            ]}>
              5s
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.timelapseButton,
              timelapseOption === 10000 && styles.timelapseButtonActive,
            ]}
            onPress={() => setTimelapseOption(10000)}
          >
            <Text style={[
              styles.timelapseText,
              timelapseOption === 10000 && styles.timelapseTextActive,
            ]}>
              10s
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.timelapseButton,
              timelapseOption === 15000 && styles.timelapseButtonActive,
            ]}
            onPress={() => setTimelapseOption(15000)}
          >
            <Text style={[
              styles.timelapseText,
              timelapseOption === 15000 && styles.timelapseTextActive,
            ]}>
              15s
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Immobility Difficulty</Text>
        <DifficultySelector 
          mode={immobilityDifficulty} 
          onModeChange={handleCycleImmobilityDifficulty}
          disabled={false}
        />
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Detection Difficulty</Text>
        <DifficultySelector 
          mode={poopDifficulty} 
          onModeChange={handleCyclePoopDifficulty}
          disabled={false}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleStartChallenge}
      >
        <Text style={styles.buttonText}>START CHALLENGE</Text>
      </TouchableOpacity>
    </>
  );

  const renderImmobilityPhase = () => {
    const statusColor = status === 'running' ? '#4ade80' : '#dc2626';
    const statusText = status === 'running' ? 'Stay Still! ✓' : 'Movement Detected! ⚠️';

    return (
      <>
        <Text style={styles.title}>Stay Immobile!</Text>
        <Text style={styles.description}>
          Don't move until the timer ends{'\n'}
          Any movement will reset the timer
        </Text>

        <Card
          title="Status"
          value={statusText}
          titleColor={colors.card}
          valueColor={statusColor}
          style={styles.card}
        />

        <Card
          title="Time Remaining"
          value={formatTime(remainingTime)}
          titleColor={colors.card}
          valueColor={colors.value}
          style={styles.card}
        />

        <TouchableOpacity
          style={[styles.button, styles.buttonStop]}
          onPress={handleStopImmobility}
        >
          <Text style={styles.buttonText}>STOP CHALLENGE</Text>
        </TouchableOpacity>
      </>
    );
  };

  const renderPromptPhase = () => (
    <>
      <Text style={styles.title}>Immobility Complete! ✓</Text>
      <Text style={styles.description}>
        Stay seated and prepare to record{'\n'}
        Press the button when ready
      </Text>

      <Card
        title="Immobility Duration"
        value={formatTime(finalImmobilityTime)}
        titleColor={colors.card}
        valueColor="#4ade80"
        style={styles.card}
      />

      <TouchableOpacity
        style={[styles.button, styles.buttonRecording]}
        onPress={handleStartRecording}
      >
        <Text style={styles.buttonText}>START RECORDING</Text>
      </TouchableOpacity>
    </>
  );

  const renderRecordingPhase = () => {
    const { canRecord, canAnalyze } = useRecordingButtonState(
      isRecording,
      isAnalyzing,
      audioUri,
      detectionResult
    );

    return (
      <>
        <Text style={styles.title}>Record the Flush 🚽</Text>
        <Text style={styles.description}>
          Record toilet flush sound{'\n'}
          for verification
        </Text>

        {isRecording && (
          <Card
            title="Status"
            value="🎤 Recording..."
            titleColor={colors.card}
            valueColor="#dc2626"
            style={styles.card}
          />
        )}

        {isAnalyzing && (
          <Card
            title="Status"
            value="🔍 Analyzing..."
            titleColor={colors.card}
            valueColor={colors.value}
            style={styles.card}
          />
        )}

        {error && !rateLimitError && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {rateLimitError && (
          <Text style={styles.rateLimitText}>
            {rateLimitError.message}
          </Text>
        )}

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

          {audioUri && !detectionResult && (
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
        </View>
      </>
    );
  };

  const renderResultsPhase = () => {
    // Determine overall success
    const overallSuccess = immobilityAchieved && 
                          detectionResult && 
                          detectionResult.detected;

    return (
      <>
        <Text style={styles.title}>
          {overallSuccess ? 'Challenge Complete! 🎉' : 'Challenge Failed 😢'}
        </Text>
        <Text style={styles.description}>
          {overallSuccess 
            ? 'You mastered both challenges!' 
            : immobilityAchieved 
              ? 'Immobility succeeded, but detection failed'
              : 'Movement detected during immobility'}
        </Text>

        <Card
          title="Overall Result"
          value={overallSuccess ? '✅ SUCCESS' : '❌ FAILED'}
          titleColor={colors.card}
          valueColor={overallSuccess ? '#4ade80' : '#dc2626'}
          style={styles.card}
        />

        <Card
          title="Immobility Result"
          value={immobilityAchieved ? '✓ Completed' : '✗ Failed'}
          titleColor={colors.card}
          valueColor={immobilityAchieved ? '#4ade80' : '#dc2626'}
          style={styles.card}
        />

        <Card
          title="Immobility Duration"
          value={formatTime(finalImmobilityTime)}
          titleColor={colors.card}
          valueColor={colors.value}
          style={styles.card}
        />

        {detectionResult && (
          <>
            <Card
              title="Detection Result"
              value={detectionResult.detected ? '✓ Flush Detected' : '✗ Not Detected'}
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
              title="Recording Duration"
              value={`${detectionResult.duration_seconds.toFixed(1)}s`}
              titleColor={colors.card}
              valueColor={colors.value}
              style={styles.card}
            />
          </>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={handleNewChallenge}
        >
          <Text style={styles.buttonText}>NEW CHALLENGE</Text>
        </TouchableOpacity>
      </>
    );
  };

  // Monitor when detection completes to move to results
  useEffect(() => {
    if (phase === 'recording' && detectionResult) {
      setPhase('results');
    }
  }, [phase, detectionResult]);

  return (
    <View style={styles.container}>
      {phase === 'setup' && renderSetupPhase()}
      {phase === 'immobility' && renderImmobilityPhase()}
      {phase === 'prompt' && renderPromptPhase()}
      {phase === 'recording' && renderRecordingPhase()}
      {phase === 'results' && renderResultsPhase()}
      
      <NavigationHint text="← Swipe to navigate →" />
    </View>
  );
}
