import { Text, View, TouchableOpacity } from 'react-native';
import { useAuth } from '../hooks';
import { NavigationHint } from '../components';
import { homeStyles as styles } from '../styles';

export default function Home() {
  const { getUserDisplayName, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.email}>{getUserDisplayName()}</Text>
      
      <TouchableOpacity style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
      
      <NavigationHint text="← Swipe to discover →" />
    </View>
  );
}
