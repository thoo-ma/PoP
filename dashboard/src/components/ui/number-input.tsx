'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

/* Tiny inline icons – avoids adding lucide-react as a dependency */
function MinusIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'size'> {
  value: number
  onChange: (value: string) => void
  step?: number
  /** overall height – 'sm' = h-7, 'default' = h-8 */
  size?: 'sm' | 'default'
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, value, onChange, step = 1, size = 'default', ...props }, ref) => {
    const bump = (dir: 1 | -1) => {
      const next = parseFloat((value + dir * step).toFixed(10))
      onChange(String(next))
    }

    const iconCls = size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'

    return (
      <div
        className={cn(
          'flex items-center rounded-md border border-neutral-700 bg-neutral-900 overflow-hidden',
          size === 'sm' ? 'h-7' : 'h-8',
          className,
        )}
      >
        <Button
          type="button"
          variant="ghost"
          onClick={() => bump(-1)}
          className={cn(
            'shrink-0 rounded-none border-r border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800 px-1.5',
            size === 'sm' ? 'h-7 w-6' : 'h-8 w-7',
          )}
          tabIndex={-1}
        >
          <MinusIcon className={iconCls} />
        </Button>

        <input
          ref={ref}
          type="number"
          value={value}
          step={step}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'flex-1 min-w-0 bg-transparent text-center text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
            size === 'sm' ? 'text-xs px-1' : 'text-sm px-2',
          )}
          {...props}
        />

        <Button
          type="button"
          variant="ghost"
          onClick={() => bump(1)}
          className={cn(
            'shrink-0 rounded-none border-l border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800 px-1.5',
            size === 'sm' ? 'h-7 w-6' : 'h-8 w-7',
          )}
          tabIndex={-1}
        >
          <PlusIcon className={iconCls} />
        </Button>
      </div>
    )
  },
)
NumberInput.displayName = 'NumberInput'

export { NumberInput }
