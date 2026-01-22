import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import Card from '../components/Card';
import { colors, typography, layout } from '../constants/theme';

export default function ProofOfTime() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Proof of Time</Text>
      <Text style={styles.description}>
        Time is your most precious resource{'\n'}
        Every second counts
      </Text>
      
      <Card
        title="⏰ Current Time"
        value={time.toLocaleTimeString('en-US')}
        titleColor={colors.timeCard}
        valueColor={colors.timeValue}
        style={styles.card}
      />
      
      <Card
        title="📅 Date"
        value={time.toLocaleDateString('en-US')}
        titleColor={colors.timeCard}
        valueColor={colors.timeValue}
        style={styles.card}
      />
      
      <Text style={styles.hint}>← Swipe to go back</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...layout.container,
    backgroundColor: colors.timeBackground,
  },
  title: {
    ...typography.title,
    color: colors.timeTitle,
  },
  description: {
    ...typography.description,
    color: colors.timeText,
  },
  card: {
    marginBottom: 24,
    minWidth: 250,
  },
  hint: {
    ...typography.hint,
    color: colors.timeHint,
    marginTop: 24,
  },
});
