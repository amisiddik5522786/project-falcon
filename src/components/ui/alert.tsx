import * as React from 'react'

import { cn } from '#/lib/utils.ts'

const alertVariants = {
  default: 'border-border/70 bg-background text-foreground',
  success: 'border-success/30 bg-success/10 text-success',
  warning: 'border-warning/30 bg-warning/10 text-warning-foreground',
  error: 'border-error/30 bg-error/10 text-error',
  info: 'border-info/30 bg-info/10 text-info',
} as const

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof alertVariants
}

function Alert({ className, variant = 'default', ...props }: AlertProps) {
  return <div data-slot="alert" className={cn('rounded-[20px] border p-4 text-sm', alertVariants[variant], className)} {...props} />
}

function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h5 className={cn('mb-1 font-semibold', className)} {...props} />
}

function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <div className={cn('text-sm leading-6', className)} {...props} />
}

export { Alert, AlertDescription, AlertTitle }
