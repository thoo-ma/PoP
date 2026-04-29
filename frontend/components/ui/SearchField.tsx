import {
  SearchField as HeroSearchField,
  type SearchFieldClearButtonProps,
  type SearchFieldInputProps,
  type SearchFieldProps,
} from 'heroui-native'
import { forwardRef, memo } from 'react'
import type { TextInput as TextInputType, View } from 'react-native'

import { cn } from '@/lib/tv'

export type { SearchFieldProps }

const SearchFieldRoot = forwardRef<View, SearchFieldProps>(function SearchField(props, ref) {
  return <HeroSearchField ref={ref} {...props} />
})

const SearchFieldInput = forwardRef<TextInputType, SearchFieldInputProps>(function SearchFieldInput(
  { className, variant = 'secondary', ...rest },
  ref,
) {
  return (
    <HeroSearchField.Input
      ref={ref}
      {...rest}
      variant={variant}
      className={cn(
        'h-control-md rounded-full border-border bg-surface-secondary py-0 font-bold text-foreground',
        className,
      )}
    />
  )
})

const SearchFieldClearButton = forwardRef<View, SearchFieldClearButtonProps>(
  function SearchFieldClearButton({ className, ...rest }, ref) {
    return (
      <HeroSearchField.ClearButton
        ref={ref}
        {...rest}
        className={cn('bg-transparent', className)}
      />
    )
  },
)

/**
 * Brand-wrapped `SearchField`. Keeps HeroUI's compound API but brands the
 * field shell to match PoP's flatter secondary-control treatment.
 */
export const SearchField = Object.assign(memo(SearchFieldRoot), {
  Group: HeroSearchField.Group,
  SearchIcon: HeroSearchField.SearchIcon,
  Input: memo(SearchFieldInput),
  ClearButton: memo(SearchFieldClearButton),
})
