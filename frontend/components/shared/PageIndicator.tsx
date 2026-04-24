import { MaterialCommunityIcons } from '@expo/vector-icons'
import type { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs'
import { memo, useLayoutEffect, useRef } from 'react'
import { Animated, Pressable, Text, View } from 'react-native'
import { useCSSVariable } from 'uniwind'
import { pageIndicator } from '@/layouts'

const TAB_ICONS: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  Poop: 'emoticon-poop',
  Vault: 'treasure-chest',
  Breed: 'flask-round-bottom',
  Repair: 'hammer-screwdriver',
  Profile: 'emoticon-happy',
}

const TAB_LABELS: Record<string, string> = {
  Poop: 'Home',
  Vault: 'Vault',
  Breed: 'Breed',
  Repair: 'Repair',
  Profile: 'Profile',
}

type TabItemProps = {
  routeKey: string
  routeName: string
  isFocused: boolean
  onPress: () => void
  activeColor: string
  inactiveColor: string
}

const TabItem = memo(function TabItem({
  routeKey,
  routeName,
  isFocused,
  onPress,
  activeColor,
  inactiveColor,
}: TabItemProps) {
  const translateY = useRef(new Animated.Value(0)).current
  const s = pageIndicator()
  const icon = TAB_ICONS[routeName] ?? 'circle'
  const label = TAB_LABELS[routeName] ?? routeName

  useLayoutEffect(() => {
    if (isFocused) {
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: 3,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [isFocused, translateY])

  return (
    <Animated.View style={{ transform: [{ translateY }] }}>
      <Pressable
        key={routeKey}
        onPress={onPress}
        className={s.navButton()}
        accessibilityLabel={label}
        accessibilityRole="tab"
        accessibilityState={{ selected: isFocused }}
      >
        <View className={s.iconContainer()}>
          <MaterialCommunityIcons
            name={icon}
            size={28}
            color={isFocused ? activeColor : inactiveColor}
          />
          <Text
            className={pageIndicator({ active: isFocused }).navLabel()}
            style={{ color: isFocused ? activeColor : inactiveColor }}
          >
            {label}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  )
})

export default memo(function PageIndicator({ state, navigation }: MaterialTopTabBarProps) {
  const [active, inactive] = useCSSVariable(['--foreground', '--muted']) as [string, string]
  const s = pageIndicator()
  return (
    <View className={s.wrapper()}>
      <View className={s.rail()}>
        {state.routes.map((route, index) => (
          <TabItem
            key={route.key}
            routeKey={route.key}
            routeName={route.name}
            isFocused={state.index === index}
            onPress={() => {
              const isFocused = state.index === index
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              })
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name)
              }
            }}
            activeColor={active}
            inactiveColor={inactive}
          />
        ))}
      </View>
    </View>
  )
})
