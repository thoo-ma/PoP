import { StyleSheet, Text, View } from 'react-native';
import Card from '../components/Card';
import { colors, typography, layout } from '../constants/theme';

export default function ProofOfImmobility() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Proof of Immobility</Text>
      <Text style={styles.description}>
        This page demonstrates your immobility{'\n'}
        Stay still to accumulate proofs
      </Text>
      
      <Card
        title="📍 Status"
        value="Immobile"
        titleColor={colors.immobilityCard}
        valueColor={colors.immobilityValue}
        style={styles.card}
      />
      
      <Text style={styles.hint}>← Swipe to navigate →</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...layout.container,
    backgroundColor: colors.immobilityBackground,
  },
  title: {
    ...typography.title,
    color: colors.immobilityTitle,
  },
  description: {
    ...typography.description,
    color: colors.immobilityText,
  },
  card: {
    marginBottom: 48,
  },
  hint: {
    ...typography.hint,
    color: colors.immobilityHint,
  },
});
