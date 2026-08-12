import * as React from 'react'
import { X } from 'lucide-react'
import { Toast as ToastPrimitive } from 'radix-ui'

import { Button } from '#/components/ui/button.tsx'
import { cn } from '#/lib/utils.ts'

function ToastProvider({ ...props }: React.ComponentProps<typeof ToastPrimitive.Provider>) {
  return <ToastPrimitive.Provider data-slot="toast-provider" {...props} />
}

function ToastViewport({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Viewport>) {
  return <ToastPrimitive.Viewport data-slot="toast-viewport" className={cn('fixed bottom-4 right-4 z-[var(--z-toast)] flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-2', className)} {...props} />
}

function Toast({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Root>) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      className={cn('rounded-[20px] border border-border/70 bg-background p-4 shadow-lg', className)}
      {...props}
    />
  )
}

function ToastTitle({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Title>) {
  return <ToastPrimitive.Title data-slot="toast-title" className={cn('text-sm font-semibold', className)} {...props} />
}

function ToastDescription({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Description>) {
  return <ToastPrimitive.Description data-slot="toast-description" className={cn('mt-1 text-sm text-muted-foreground', className)} {...props} />
}

function ToastAction({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Action>) {
  return <ToastPrimitive.Action data-slot="toast-action" className={cn('mt-3', className)} {...props} />
}

function ToastClose({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Close>) {
  return (
    <ToastPrimitive.Close asChild {...props}>
      <Button variant="ghost" size="icon-sm" className={cn('absolute right-3 top-3', className)}>
        <X className="size-4" />
      </Button>
    </ToastPrimitive.Close>
  )
}

export { Toast, ToastAction, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport }
