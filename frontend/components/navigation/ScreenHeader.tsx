import { memo } from 'react';
import { Text, View } from 'react-native';
import { screenTitle } from '@/styles';

interface ScreenHeaderProps {
  title: string;
}

export default memo(function ScreenHeader({ title }: ScreenHeaderProps) {
  return (
    <View className="absolute top-[60px] left-0 right-0 z-[99] items-center justify-center pointer-events-none">
      <Text className={screenTitle({ spacing: 'sm', color: 'accent' })}>{title}</Text>
    </View>
  );
});
