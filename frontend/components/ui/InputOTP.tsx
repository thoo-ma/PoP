/**
 * Brand-wrapped `InputOTP`. Pass-through today — exists so consumers route
 * through `@/components/ui` instead of importing `heroui-native` directly.
 * Swap the re-export for a memoized `Object.assign` wrapper (see `Button`,
 * `Card`) when a brand default needs to be baked in.
 *
 * Also re-exports the `REGEXP_ONLY_DIGITS_AND_CHARS` pattern constant alongside
 * so the pattern lives next to its primary consumer.
 */
export {
  InputOTP,
  type InputOTPRootProps as InputOTPProps,
  REGEXP_ONLY_DIGITS_AND_CHARS,
} from 'heroui-native'
