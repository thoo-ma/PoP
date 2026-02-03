import { Alert } from 'react-native';

/**
 * Shows a confirmation alert when user wants to sign out
 * @param onConfirm - Callback to execute when user confirms sign out
 */
export function showSignOutConfirmation(onConfirm: () => void | Promise<void>): void {
  Alert.alert(
    'Sign Out',
    'Are you sure you want to sign out?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: onConfirm,
      },
    ]
  );
}
