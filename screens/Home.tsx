import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { colors, typography, layout } from '../constants/theme';

export default function Home() {
  const { getUserDisplayName, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.email}>{getUserDisplayName()}</Text>
      
      <TouchableOpacity style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
      
      <Text style={styles.hint}>← Swipe to discover →</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...layout.container,
    backgroundColor: colors.homeBackground,
  },
  title: typography.title,
  email: {
    fontSize: 16,
    color: colors.homeText,
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.homeButton,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 48,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  hint: {
    ...typography.hint,
    color: colors.hint,
  },
});
