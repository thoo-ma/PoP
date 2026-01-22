import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface CardProps {
  title: string;
  value: string;
  titleColor?: string;
  valueColor?: string;
  style?: ViewStyle;
}

export default function Card({ 
  title, 
  value, 
  titleColor = '#64748b',
  valueColor = '#1e3a8a',
  style 
}: CardProps) {
  return (
    <View style={[styles.card, style]}>
      <Text style={[styles.cardTitle, { color: titleColor }]}>{title}</Text>
      <Text style={[styles.cardValue, { color: valueColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 200,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
