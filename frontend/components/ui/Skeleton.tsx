import { Skeleton as HeroSkeleton, type SkeletonProps as HeroSkeletonProps } from 'heroui-native'
import { memo } from 'react'

export type SkeletonProps = HeroSkeletonProps

/**
 * Brand-wrapped `Skeleton`. Currently a thin passthrough — exists to satisfy
 * the `@/components/ui` import-zone rule and to give the brand a single place
 * to bake in pulse/shimmer defaults later. See `frontend/.instructions.md`
 * § "Sanctioned UI wrappers" for usage rules.
 */
export const Skeleton = memo(function Skeleton(props: SkeletonProps) {
  return <HeroSkeleton {...props} />
})
