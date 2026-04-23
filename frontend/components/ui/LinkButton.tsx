/**
 * Brand-wrapped `LinkButton`. Pass-through today — exists so consumers route
 * through `@/components/ui` instead of importing `heroui-native` directly.
 * Swap the re-export for a memoized `Object.assign` wrapper (see `Button`,
 * `Card`) when a brand default needs to be baked in.
 */
export { LinkButton, type LinkButtonProps } from 'heroui-native'
