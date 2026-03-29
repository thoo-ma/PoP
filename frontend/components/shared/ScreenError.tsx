import { memo } from "react";
import { View } from "react-native";
import { Alert, Button } from "heroui-native";

interface ScreenErrorProps {
  title: string;
  message: string;
  onRetry?: () => void;
}

export default memo(function ScreenError({ title, message, onRetry }: ScreenErrorProps) {
  return (
    <View className="flex-1 bg-background items-center justify-center px-6">
      <Alert status="danger">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>{title}</Alert.Title>
          <Alert.Description>{message}</Alert.Description>
        </Alert.Content>
      </Alert>
      {onRetry && (
        <Button variant="primary" onPress={onRetry} className="mt-4">
          Retry
        </Button>
      )}
    </View>
  );
});
