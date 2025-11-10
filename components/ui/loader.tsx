'use client'

import React from "react"
import { cn } from "@/lib/utils"

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'spinner' | 'dots' | 'pulse' | 'wave' | 'phone'
  className?: string
  text?: string
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24'
}

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl'
}

const getDotSize = (size: string) => {
  switch (size) {
    case 'sm': return 'w-2 h-2'
    case 'md': return 'w-3 h-3'
    case 'lg': return 'w-4 h-4'
    case 'xl': return 'w-5 h-5'
    default: return 'w-3 h-3'
  }
}

const getPhoneSize = (size: string) => {
  switch (size) {
    case 'sm': return 'w-8 h-14'
    case 'md': return 'w-12 h-20'
    case 'lg': return 'w-16 h-28'
    case 'xl': return 'w-24 h-40'
    default: return 'w-12 h-20'
  }
}

const getButtonSize = (size: string) => {
  switch (size) {
    case 'sm': return 'w-2 h-2'
    case 'md': return 'w-3 h-3'
    case 'lg': return 'w-4 h-4'
    case 'xl': return 'w-6 h-6'
    default: return 'w-3 h-3'
  }
}

const getBarSize = (size: string) => {
  switch (size) {
    case 'sm': return 'w-1 h-4'
    case 'md': return 'w-1.5 h-6'
    case 'lg': return 'w-2 h-8'
    case 'xl': return 'w-3 h-12'
    default: return 'w-1.5 h-6'
  }
}

function SpinnerLoader({ size, text, className }: Omit<LoaderProps, 'variant'>) {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      <div className={cn(
        "animate-spin rounded-full border-4 border-muted border-t-primary",
        sizeClasses[size || 'md']
      )} />
      {text && (
        <p className={cn("text-muted-foreground animate-pulse", textSizeClasses[size || 'md'])}>
          {text}
        </p>
      )}
    </div>
  )
}

function DotsLoader({ size, text, className }: Omit<LoaderProps, 'variant'>) {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "rounded-full bg-primary animate-bounce",
              getDotSize(size || 'md')
            )}
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: '0.6s'
            }}
          />
        ))}
      </div>
      {text && (
        <p className={cn("text-muted-foreground", textSizeClasses[size || 'md'])}>
          {text}
        </p>
      )}
    </div>
  )
}

function PulseLoader({ size, text, className }: Omit<LoaderProps, 'variant'>) {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      <div className={cn(
        "rounded-full bg-gradient-to-r from-primary to-accent animate-pulse",
        sizeClasses[size || 'md']
      )} />
      {text && (
        <p className={cn("text-muted-foreground animate-pulse", textSizeClasses[size || 'md'])}>
          {text}
        </p>
      )}
    </div>
  )
}

function WaveLoader({ size, text, className }: Omit<LoaderProps, 'variant'>) {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      <div className="flex space-x-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "bg-gradient-to-t from-primary to-accent rounded-sm animate-pulse",
              getBarSize(size || 'md')
            )}
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
      {text && (
        <p className={cn("text-muted-foreground", textSizeClasses[size || 'md'])}>
          {text}
        </p>
      )}
    </div>
  )
}

function PhoneLoader({ size, text, className }: Omit<LoaderProps, 'variant'>) {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-6", className)}>
      <div className="relative">
        {/* Spinning phone icon - the phone itself spins */}
        <div className={cn(
          "relative rounded-2xl border-4 border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 animate-spin",
          getPhoneSize(size || 'md')
        )} style={{ animationDuration: '1.5s' }}>
          <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <div className={cn(
              "rounded-full bg-gradient-to-r from-primary/60 to-accent/60",
              getButtonSize(size || 'md')
            )} />
          </div>
        </div>
        
        {/* Orbiting particles around the spinning phone */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}>
          <div className="absolute -top-3 -right-3">
            <div className={cn(
              "rounded-full bg-accent/70 animate-pulse",
              getDotSize(size || 'md')
            )} />
          </div>
          <div className="absolute -bottom-3 -left-3">
            <div className={cn(
              "rounded-full bg-primary/70 animate-pulse",
              getDotSize(size || 'md')
            )} />
          </div>
        </div>
      </div>
      
      {text && (
        <div className="text-center">
          <p className={cn(
            "text-foreground font-medium",
            textSizeClasses[size || 'md']
          )}>
            {text}
          </p>
          <div className="flex justify-center mt-2">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-1 h-1 bg-accent/70 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-1 h-1 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function Loader({ 
  size = 'md', 
  variant = 'phone', 
  className,
  text = "Loading..."
}: LoaderProps) {
  const props = { size, text, className }

  switch (variant) {
    case 'spinner':
      return <SpinnerLoader {...props} />
    case 'dots':
      return <DotsLoader {...props} />
    case 'pulse':
      return <PulseLoader {...props} />
    case 'wave':
      return <WaveLoader {...props} />
    case 'phone':
      return <PhoneLoader {...props} />
    default:
      return <PhoneLoader {...props} />
  }
}

// Full Screen Loader Component
export function FullScreenLoader({ 
  variant = 'spinner', 
  text = "Loading PhoneFront...",
  className 
}: Omit<LoaderProps, 'size'>) {
  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center",
      "bg-gradient-to-r from-primary/10 via-background to-background",
      className
    )}>
      <div className="flex flex-col items-center justify-center space-y-6">
        <Loader 
          size="xl" 
          variant={variant} 
          text={text}
        />
      </div>
    </div>
  )
}

// Page Loader Component
export function PageLoader({ 
  variant = 'spinner', 
  text = "Loading...",
  className 
}: Omit<LoaderProps, 'size'>) {
  return (
    <div className={cn(
      "flex items-center justify-center min-h-[60vh]",
      "bg-gradient-to-r from-primary/10 via-background to-background",
      className
    )}>
      <Loader 
        size="lg" 
        variant={variant} 
        text={text}
      />
    </div>
  )
}