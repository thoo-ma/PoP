import { type CardRootProps, Card as HeroCard } from 'heroui-native'
import { memo } from 'react'

import { cn } from '@/lib/tv'

export type CardProps = CardRootProps

/**
 * Brand-wrapped `Card`. Bakes `rounded-card` (16px) + hairline brand border
 * into every instance. Compound parts (`Header`, `Body`, `Footer`, `Title`,
 * `Description`) pass through unchanged. See `frontend/.instructions.md`
 * § "Sanctioned UI wrappers" for usage rules.
 */
export const Card = Object.assign(
  memo(function Card({ className, ...rest }: CardProps) {
    return (
      <HeroCard {...rest} className={cn('rounded-card border-hairline border-border', className)} />
    )
  }),
  {
    Header: HeroCard.Header,
    Body: HeroCard.Body,
    Footer: HeroCard.Footer,
    Title: HeroCard.Title,
    Description: HeroCard.Description,
  },
)
