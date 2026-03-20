import { Text, View } from 'react-native';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Avatar, Button, Dialog } from 'heroui-native';
import { useAuth } from '@/hooks';
import { showSignOutConfirmation } from '@/utils';
import Wallet from './Wallet';

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
  const [walletVisible, setWalletVisible] = useState(false);

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

  const initials = getUserDisplayName()
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Dialog isOpen={visible} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay isCloseOnPress />
        <Dialog.Content className="mx-auto w-[85%] max-w-[400px] rounded-3xl px-8 py-8 items-center">
          {/* Wallet modal */}
          <Wallet visible={walletVisible} onClose={() => setWalletVisible(false)} />

          <Dialog.Close
            variant="ghost"
            accessibilityLabel="Close profile"
            className="absolute top-4 right-4"
          />

          {/* Avatar */}
          <View className="mt-4 mb-4">
            <Avatar size="lg" color="accent" alt={getUserDisplayName() || 'User avatar'}>
              <Avatar.Fallback>
                {initials || <MaterialIcons name="person" size={28} />}
              </Avatar.Fallback>
            </Avatar>
          </View>

          {/* User info */}
          <Dialog.Title className="text-3xl font-bold text-foreground mb-2">Profile</Dialog.Title>
          <Text className="text-lg font-semibold text-foreground mb-1">{getUserDisplayName()}</Text>
          {user?.email && (
            <Text className="text-base text-muted mb-6">{user.email}</Text>
          )}

          {/* Stats section */}
          <View className="flex-row justify-around items-center w-full py-5 mb-6 bg-default rounded-xl">
            <View className="flex-1 items-center">
              <Text className="text-xl font-bold text-foreground">0</Text>
              <Text className="text-sm text-muted">Detections</Text>
            </View>
            <View className="w-px h-8 bg-border" />
            <View className="flex-1 items-center">
              <Text className="text-xl font-bold text-foreground">0</Text>
              <Text className="text-sm text-muted">NFTs</Text>
            </View>
            <View className="w-px h-8 bg-border" />
            <View className="flex-1 items-center">
              <Text className="text-xl font-bold text-foreground">0</Text>
              <Text className="text-sm text-muted">Days Active</Text>
            </View>
          </View>

          {/* Sign out button */}
          <Button
            variant="primary"
            className="w-full mb-2.5"
            onPress={handleSignOut}
            isDisabled={isSigningOut}
            accessibilityLabel="Sign out"
            accessibilityHint="Sign out of your account"
          >
            <MaterialIcons name="logout" size={18} color="#fff" />
            <Button.Label>Sign Out</Button.Label>
          </Button>

          {/* Wallet button */}
          <Button
            variant="secondary"
            className="w-full"
            onPress={() => setWalletVisible(true)}
            accessibilityLabel="Open wallet"
          >
            <Text className="text-lg">💩</Text>
            <Button.Label>Wallet</Button.Label>
          </Button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
