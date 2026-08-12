import { LoaderCircle } from 'lucide-react'

import { cn } from '#/lib/utils.ts'

interface SpinnerProps {
  className?: string
  label?: string
}

export function Spinner({ className, label = 'Loading' }: SpinnerProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground" role="status" aria-live="polite">
      <LoaderCircle className={cn('size-4 animate-spin', className)} />
      <span>{label}</span>
    </div>
  )
}
