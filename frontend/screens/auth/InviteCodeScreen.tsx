import { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { Button, Spinner, TextField, Input, Label, Description, FieldError } from "heroui-native";
import { validateInviteCode } from "@/lib/inviteCodeApi";
import { useSignOutDialog } from "@/utils";
import { useErrorHandler } from "@/hooks";

interface InviteCodeScreenProps {
  /** Called after the entered code is validated and the user is approved. */
  onApprovalSuccess: () => void;
  /** Called when the user chooses to sign out from this screen. */
  onSignOut: () => void;
}

/**
 * Invite-code gate screen shown to authenticated users who are not yet approved.
 * Accepts a 6-character code, validates it via the `validate_invite_code` RPC,
 * then calls `onApprovalSuccess` on success.
 */
export default function InviteCodeScreen({ onApprovalSuccess, onSignOut }: InviteCodeScreenProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { error, handleError, clearError } = useErrorHandler("InviteCode");
  const inputRef = useRef<TextInput>(null);
  const { dialog: signOutDialog, show: showSignOutDialog } = useSignOutDialog();

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
    const cleaned = text.toUpperCase().replace(/[^A-Z0-9]/g, "");
    setCode(cleaned.slice(0, 8)); // Limit to 8 characters
    clearError(); // Clear error when user types
  };

  const handleSubmit = async () => {
    // Validate format before submitting
    if (!isValidFormat(code)) {
      handleError(
        new Error("Code must be 8 alphanumeric characters"),
        "Code must be 8 alphanumeric characters",
      );
      return;
    }

    setLoading(true);
    clearError();

    try {
      const result = await validateInviteCode(code);

      if (result.success) {
        // Clear the code input and show success state
        setCode("");
        clearError();

        // Success! Notify parent to refresh approval status
        onApprovalSuccess();
      } else {
        // Show specific error message from backend
        handleError(result.error || "Invalid invite code", result.error || "Invalid invite code");
      }
    } catch (err) {
      handleError(err, "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    showSignOutDialog(onSignOut);
  };

  const canSubmit = code.length === 8 && !loading;

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center p-5 bg-background"
      >
        <View className="flex-1 justify-center">
          <Text className="text-[28px] font-bold mb-2 text-center text-primary">Welcome! 🎉</Text>
          <Text className="text-base text-gray-500 mb-10 text-center leading-6">
            Enter your invite code to access the app
          </Text>

          <TextField isInvalid={!!error} className="mb-4">
            <Label>Invite Code</Label>
            <Input
              ref={inputRef}
              value={code}
              onChangeText={handleCodeChange}
              placeholder="ABC12XYZ"
              maxLength={8}
              autoCapitalize="characters"
              autoCorrect={false}
              autoComplete="off"
              keyboardType="ascii-capable"
              returnKeyType="done"
              accessibilityLabel="Invite code"
              accessibilityHint="Enter your 8-character invite code"
              onSubmitEditing={handleSubmit}
              editable={!loading}
              className="text-center text-2xl font-semibold tracking-widest uppercase"
            />
            <Description>8 alphanumeric characters</Description>
            {error && <FieldError>{error}</FieldError>}
          </TextField>

          {loading && (
            <View className="mb-4 items-center">
              <Spinner size="lg" />
            </View>
          )}

          <Button
            variant="primary"
            onPress={handleSubmit}
            isDisabled={!canSubmit}
            className="mb-4"
            accessibilityLabel="Submit invite code"
            accessibilityHint="Validate and submit your invite code"
          >
            {loading ? "Validating..." : "Submit"}
          </Button>

          <Button variant="outline" onPress={handleSignOut} isDisabled={loading}>
            Sign Out
          </Button>
        </View>
      </KeyboardAvoidingView>
      {signOutDialog}
    </>
  );
}
