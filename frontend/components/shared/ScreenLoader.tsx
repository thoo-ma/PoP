import { memo } from 'react';
import { Text, View } from 'react-native';
import { Spinner } from 'heroui-native';
import { screenTitle } from '@/styles';

interface ScreenLoaderProps {
  title: string;
  message?: string;
}

export default memo(function ScreenLoader({ title, message }: ScreenLoaderProps) {
  return (
    <View className="flex-1 bg-background items-center pt-[60px]">
      <Text className={screenTitle({ color: 'neutral' })}>{title}</Text>
      <Spinner size="lg" className="mt-10" />
      {message && <Text className="mt-3 text-sm text-gray-500">{message}</Text>}
    </View>
  );
});
