import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { validateInviteCode } from '../../lib/inviteCodeApi';
import { inviteCodeScreenStyles as styles } from '../../styles';
import { showSignOutConfirmation } from '../../utils';
import { useErrorHandler } from '../../hooks';
import { colors } from '../../constants';

interface InviteCodeScreenProps {
  onApprovalSuccess: () => void;
  onSignOut: () => void;
}

export function InviteCodeScreen({ onApprovalSuccess, onSignOut }: InviteCodeScreenProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { error, handleError, clearError } = useErrorHandler('InviteCode');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Auto-focus input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Validate code format (8 alphanumeric characters)
  const isValidFormat = (text: string): boolean => {
    return /^[A-Z0-9]{8}$/.test(text);
  };

  const handleCodeChange = (text: string) => {
    // Convert to uppercase and filter non-alphanumeric
    const cleaned = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setCode(cleaned.slice(0, 8)); // Limit to 8 characters
    clearError(); // Clear error when user types
  };

  const handleSubmit = async () => {
    // Validate format before submitting
    if (!isValidFormat(code)) {
      handleError('Code must be 8 alphanumeric characters', 'Code must be 8 alphanumeric characters');
      return;
    }

    setLoading(true);
    clearError();

    try {
      const result = await validateInviteCode(code);

      if (result.success) {
        // Clear the code input and show success state
        setCode('');
        clearError();
        
        // Success! Notify parent to refresh approval status
        onApprovalSuccess();
      } else {
        // Show specific error message from backend
        handleError(result.error || 'Invalid invite code', result.error || 'Invalid invite code');
      }
    } catch (err) {
      handleError(err, 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    showSignOutConfirmation(onSignOut);
  };

  const canSubmit = code.length === 8 && !loading;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome! 🎉</Text>
        <Text style={styles.subtitle}>
          Enter your invite code to access the app
        </Text>

        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            isFocused && styles.inputFocused,
            error && styles.inputError,
          ]}
          value={code}
          onChangeText={handleCodeChange}
          placeholder="ABC12XYZ"
          placeholderTextColor={colors.disabled}
          maxLength={8}
          autoCapitalize="characters"
          autoCorrect={false}
          autoComplete="off"
          keyboardType="ascii-capable"
          returnKeyType="done"
          accessibilityLabel="Invite code"
          accessibilityHint="Enter your 8-character invite code"
          onSubmitEditing={handleSubmit}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!loading}
        />
        
        <Text style={styles.helperText}>
          8 alphanumeric characters
        </Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.submitButton,
            !canSubmit && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!canSubmit}
          accessibilityLabel="Submit invite code"
          accessibilityRole="button"
          accessibilityHint="Validate and submit your invite code"
          accessibilityState={{ disabled: !canSubmit, busy: loading }}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Validating...' : 'Submit'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          disabled={loading}
        >
          <Text style={styles.signOutButtonText}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
