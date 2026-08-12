import * as React from 'react'
import { ChevronRight, Home } from 'lucide-react'

import { cn } from '#/lib/utils.ts'

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

function Breadcrumb({ className, ...props }: BreadcrumbProps) {
  return <nav aria-label="Breadcrumb" data-slot="breadcrumb" className={cn('flex items-center gap-2 text-sm text-muted-foreground', className)} {...props} />
}

function BreadcrumbList({ className, ...props }: React.OlHTMLAttributes<HTMLOListElement>) {
  return <ol data-slot="breadcrumb-list" className={cn('flex flex-wrap items-center gap-2', className)} {...props} />
}

function BreadcrumbItem({ className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) {
  return <li data-slot="breadcrumb-item" className={cn('flex items-center gap-2', className)} {...props} />
}

function BreadcrumbLink({ className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a data-slot="breadcrumb-link" className={cn('transition-colors hover:text-foreground', className)} {...props} />
}

function BreadcrumbSeparator({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span data-slot="breadcrumb-separator" className={cn('text-muted-foreground', className)} {...props}><ChevronRight className="size-4" /></span>
}

function BreadcrumbPage({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span data-slot="breadcrumb-page" className={cn('font-medium text-foreground', className)} {...props} />
}

function BreadcrumbHome() {
  return (
    <BreadcrumbItem>
      <BreadcrumbLink href="/">
        <Home className="size-4" />
      </BreadcrumbLink>
    </BreadcrumbItem>
  )
}

export { Breadcrumb, BreadcrumbHome, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator }
