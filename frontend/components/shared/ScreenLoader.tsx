import { memo } from "react";
import { Text, View } from "react-native";
import { Spinner } from "heroui-native";

interface ScreenLoaderProps {
  title?: string;
  message?: string;
}

export default memo(function ScreenLoader({ message }: ScreenLoaderProps) {
  return (
    <View className="flex-1 bg-background items-center justify-center">
      <Spinner size="lg" />
      {message && <Text className="mt-3 text-sm text-gray-500">{message}</Text>}
    </View>
  );
});
