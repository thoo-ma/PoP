/**
 * Brand-wrapped `Dialog`. Pass-through today — exists so consumers route
 * through `@/components/ui` instead of importing `heroui-native` directly.
 * Swap the re-export for a memoized `Object.assign` wrapper (see `Button`,
 * `Card`) when a brand default needs to be baked in.
 */
export { Dialog, type DialogRootProps as DialogProps } from 'heroui-native'
