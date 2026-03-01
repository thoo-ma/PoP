import { Text, View, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks';
import { profileStyles as styles } from '@/styles';
import { showSignOutConfirmation } from '@/utils';
import { colors } from '@/constants';

interface ProfileProps {
  /** Controls the visibility of the profile modal. */
  visible: boolean;
  /** Called when the user dismisses the profile modal. */
  onClose: () => void;
}

/**
 * Profile modal screen showing the current user's display name, email,
 * and placeholder stats (Detections, NFTs, Days Active).
 * Provides a sign-out action with a confirmation prompt.
 */
export default function Profile({ visible, onClose }: ProfileProps) {
  const { getUserDisplayName, user, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = () => {
    showSignOutConfirmation(async () => {
      setIsSigningOut(true);
      try {
        await signOut();
        onClose();
      } finally {
        setIsSigningOut(false);
      }
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable 
        style={styles.overlay}
        onPress={onClose}
      >
        <Pressable style={styles.container} onPress={() => {}}>
          {/* Close button */}
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
            accessibilityLabel="Close profile"
            accessibilityRole="button"
          >
            <MaterialIcons name="close" size={24} color={colors.primary} />
          </TouchableOpacity>

          {/* Profile icon */}
          <View style={styles.avatarContainer}>
            <MaterialIcons name="account-circle" size={80} color={colors.primary} />
          </View>

          {/* User info */}
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.displayName}>{getUserDisplayName()}</Text>
          {user?.email && (
            <Text style={styles.email}>{user.email}</Text>
          )}

          {/* Stats section */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Detections</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>NFTs</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Days Active</Text>
            </View>
          </View>

          {/* Sign out button */}
          <TouchableOpacity 
            style={styles.signOutButton} 
            onPress={handleSignOut}
            activeOpacity={0.7}
            disabled={isSigningOut}
            accessibilityLabel="Sign out"
            accessibilityRole="button"
            accessibilityHint="Sign out of your account"
            accessibilityState={{ busy: isSigningOut }}
          >
            <MaterialIcons name="logout" size={20} color={colors.buttonText} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
