import { Text, View, TouchableOpacity } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { styles } from '../styles/Home.styles';

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
