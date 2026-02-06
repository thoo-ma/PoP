import { Text, View, TouchableOpacity } from 'react-native';
import { useAuth } from '../hooks';
import { homeStyles as styles } from '../styles';
import { showSignOutConfirmation } from '../utils';

export default function Home() {
  const { getUserDisplayName, signOut } = useAuth();

  const handleSignOut = () => {
    showSignOutConfirmation(async () => {
      await signOut();
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.email}>{getUserDisplayName()}</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}
