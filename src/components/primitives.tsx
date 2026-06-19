import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from '../lib/utils'

type ButtonVariant = 'primary' | 'ghost'
type ButtonSize = 'default' | 'lg' | 'icon'

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
}

const buttonBase =
  'cursor-pointer inline-flex items-center justify-center font-mono text-nav uppercase tracking-widest transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold'

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'border border-cream bg-transparent text-cream hover:border-gold hover:bg-gold hover:text-obsidian',
  ghost: 'text-cream hover:text-gold',
}

const sizeStyles: Record<ButtonSize, string> = {
  default: 'px-8 py-3.5',
  lg: 'px-10 py-4',
  icon: 'h-8 w-8 shrink-0 items-center justify-center p-0',
}

function buttonClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  className: string
): string {
  return cn(buttonBase, variantStyles[variant], sizeStyles[size], className)
}

export function Button({
  variant = 'primary',
  size = 'default',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button type="button" className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </button>
  )
}

interface ButtonLinkProps extends ComponentPropsWithoutRef<'a'> {
  variant?: ButtonVariant
  size?: ButtonSize
  href: string
  children: ReactNode
}

export function ButtonLink({
  variant = 'primary',
  size = 'default',
  href,
  className = '',
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a href={href} className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </a>
  )
}

interface NavButtonProps extends ComponentPropsWithoutRef<'button'> {
  children: ReactNode
}

const linkBase =
  'font-mono text-nav uppercase tracking-widest text-cream transition-colors duration-300 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold'

export function NavButton({ className = '', children, ...props }: NavButtonProps) {
  return (
    <button type="button" className={cn(linkBase, className, 'cursor-pointer')} {...props}>
      {children}
    </button>
  )
}

interface RouterLinkProps extends ComponentPropsWithoutRef<typeof Link> {
  children: ReactNode
}

export function RouterLink({ className = '', children, ...props }: RouterLinkProps) {
  return (
    <Link className={cn(linkBase, className)} {...props}>
      {children}
    </Link>
  )
}
