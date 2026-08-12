import * as React from 'react'

import { cn } from '#/lib/utils.ts'

const badgeVariants = {
  default: 'border-transparent bg-primary text-primary-foreground',
  secondary: 'border-transparent bg-secondary text-secondary-foreground',
  neutral: 'border-transparent bg-neutral text-neutral-foreground',
  success: 'border-transparent bg-success text-success-foreground',
  warning: 'border-transparent bg-warning text-warning-foreground',
  error: 'border-transparent bg-error text-error-foreground',
  info: 'border-transparent bg-info text-info-foreground',
  outline: 'border-border bg-background text-foreground',
} as const

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof badgeVariants
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium leading-none',
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
