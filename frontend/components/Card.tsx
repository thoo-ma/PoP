import { Text, View } from 'react-native';
import type { CardProps } from '../types';
import { styles } from '../styles/Card.styles';

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
