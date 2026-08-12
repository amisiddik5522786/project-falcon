import * as React from 'react'
import { Command as CommandPrimitive } from 'cmdk'
import { Search } from 'lucide-react'

import { cn } from '#/lib/utils.ts'

const Command = React.forwardRef<React.ElementRef<typeof CommandPrimitive>, React.ComponentPropsWithoutRef<typeof CommandPrimitive>>(({ className, ...props }, ref) => (
  <CommandPrimitive ref={ref} className={cn('flex h-full w-full flex-col overflow-hidden rounded-lg border border-border/70 bg-popover text-popover-foreground', className)} {...props} />
))
Command.displayName = CommandPrimitive.displayName

const CommandInput = React.forwardRef<React.ElementRef<'input'>, React.ComponentPropsWithoutRef<'input'>>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b border-border/70 px-3">
    <Search className="mr-2 size-4 shrink-0 opacity-50" />
    <input ref={ref} className={cn('flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground', className)} {...props} />
  </div>
))
CommandInput.displayName = 'CommandInput'

const CommandList = React.forwardRef<React.ElementRef<'div'>, React.ComponentPropsWithoutRef<'div'>>(({ className, ...props }, ref) => (<div ref={ref} className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)} {...props} />))
CommandList.displayName = 'CommandList'

const CommandEmpty = React.forwardRef<React.ElementRef<'div'>, React.ComponentPropsWithoutRef<'div'>>(({ className, ...props }, ref) => (<div ref={ref} className={cn('py-6 text-center text-sm text-muted-foreground', className)} {...props} />))
CommandEmpty.displayName = 'CommandEmpty'

const CommandGroup = React.forwardRef<React.ElementRef<'div'>, React.ComponentPropsWithoutRef<'div'>>(({ className, ...props }, ref) => (<div ref={ref} className={cn('overflow-hidden p-1 text-foreground', className)} {...props} />))
CommandGroup.displayName = 'CommandGroup'

const CommandItem = React.forwardRef<React.ElementRef<'div'>, React.ComponentPropsWithoutRef<'div'>>(({ className, ...props }, ref) => (<div ref={ref} className={cn('relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground', className)} {...props} />))
CommandItem.displayName = 'CommandItem'

const CommandSeparator = React.forwardRef<React.ElementRef<'div'>, React.ComponentPropsWithoutRef<'div'>>(({ className, ...props }, ref) => (<div ref={ref} className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />))
CommandSeparator.displayName = 'CommandSeparator'

export { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator }
